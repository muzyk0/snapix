import { BadRequestException } from '@nestjs/common'
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { addDays } from 'date-fns'
import { PrismaService } from '@app/prisma'
import { randomUUID } from 'crypto'
import { NotificationService } from '../../../notification/services/notification.service'

export class ResendConfirmationTokenCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(ResendConfirmationTokenCommand)
export class ResendConfirmationTokenHandler
  implements ICommandHandler<ResendConfirmationTokenCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService
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
          message: "User with this email doesn't exist",
          property: 'email',
        },
      })
    }

    if (user.emailConfirmed !== null) {
      throw new BadRequestException({
        email: {
          message: 'User with this email already confirmed',
          property: 'email',
        },
      })
    }

    const emailConfirmationToken = randomUUID()

    const updatedUser = await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        emailConfirmation: {
          update: {
            token: emailConfirmationToken,
            expiresAt: addDays(new Date(), 1),
          },
        },
      },
      include: {
        emailConfirmation: true,
      },
    })

    await this.notificationService.sendEmailConfirmationCode({
      email,
      userName: updatedUser.name,
      confirmationCode: emailConfirmationToken,
    })
    return true
  }
}
