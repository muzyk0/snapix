import { BadRequestException } from '@nestjs/common'
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '@app/prisma'
import { UserService } from '../../../users/services/user.service'

export class ResendConfirmationTokenCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(ResendConfirmationTokenCommand)
export class ResendConfirmationTokenHandler
  implements ICommandHandler<ResendConfirmationTokenCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async execute({ email }: ResendConfirmationTokenCommand): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (user === null) {
      throw new BadRequestException({
        email: {
          message: "UserService with this email doesn't exist",
          property: 'email',
        },
      })
    }

    if (user.emailConfirmed !== null) {
      throw new BadRequestException({
        email: {
          message: 'UserService with this email already confirmed',
          property: 'email',
        },
      })
    }

    await this.userService.sendConfirmationToken(email)
    return true
  }
}
