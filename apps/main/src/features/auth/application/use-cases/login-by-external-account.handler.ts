import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '@app/prisma'
import { type ExternalAccount } from '../../types/externalAccount'
import { type User } from '@prisma/client'

export class LoginByExternalAccountCommand {
  constructor(public readonly externalAccount: ExternalAccount) {}
}

@CommandHandler(LoginByExternalAccountCommand)
export class LoginByExternalAccountHandler
  implements ICommandHandler<LoginByExternalAccountCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ externalAccount }: LoginByExternalAccountCommand): Promise<User> {
    const userWithExternalAccount = await this.prisma.user.findFirst({
      where: {
        accounts: {
          some: {
            providerId: externalAccount.id,
          },
        },
      },
      include: {
        accounts: true,
      },
    })

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (userWithExternalAccount) {
      return userWithExternalAccount
    }

    const user = await this.prisma.user.create({
      data: {
        name: externalAccount.displayName,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        email: externalAccount.email!,
      },
    })

    await this.prisma.account.create({
      data: {
        userId: user.id,
        name: externalAccount.displayName,
        email: externalAccount.email,
        providerId: externalAccount.id,
        photo: externalAccount.photo,
        provider: externalAccount.provider,
      },
    })

    return user
  }
}
