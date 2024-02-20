import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '@app/prisma'
import { type ExternalAccount } from '../../types/externalAccount'

export class LoginByExternalAccountCommand {
  constructor(public readonly externalAccount: ExternalAccount) {}
}

@CommandHandler(LoginByExternalAccountCommand)
export class LoginByExternalAccountHandler
  implements ICommandHandler<LoginByExternalAccountCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ externalAccount }: LoginByExternalAccountCommand): Promise<number> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        email: externalAccount.email,
      },
    })

    return user.id
  }
}
