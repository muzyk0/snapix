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

    const existingUserWithThisEmail = await this.prisma.user.findUnique({
      where: {
        email: externalAccount.email,
      },
    })

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (existingUserWithThisEmail) {
      await this.createExternalAccount(existingUserWithThisEmail.id, externalAccount)

      return existingUserWithThisEmail
    }

    const countUsers = await this.prisma.user.count()
    const user = await this.prisma.user.create({
      data: {
        name: `${externalAccount.displayName}${countUsers}`,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        email: externalAccount.email!, // todo: mayme null
      },
    })

    await this.createExternalAccount(user.id, externalAccount)

    return user
  }

  private async createExternalAccount(userId: User['id'], externalAccount: ExternalAccount) {
    await this.prisma.account.create({
      data: {
        userId,
        name: externalAccount.displayName,
        email: externalAccount.email,
        providerId: externalAccount.id,
        photo: externalAccount.photo,
        provider: externalAccount.provider,
      },
    })
  }
}
