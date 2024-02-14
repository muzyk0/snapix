import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { NotificationService } from '../../../notification/services/notification.service'
import { PrismaService } from '@app/prisma'
import { BadRequestException } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { addDays } from 'date-fns'
import { RecoveryStatusEnum } from '../../types/recovery-status.enum'
import { UserService } from '../../../users/services/user.service'

export class SendRecoveryPasswordTempCodeCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(SendRecoveryPasswordTempCodeCommand)
export class SendRecoveryPasswordTempCodeHandler
  implements ICommandHandler<SendRecoveryPasswordTempCodeCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: NotificationService,
    private readonly userService: UserService
  ) {}

  async execute({ email }: SendRecoveryPasswordTempCodeCommand): Promise<void> {
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

    if (user.emailConfirmed === null) {
      await this.userService.sendConfirmationToken(email)

      return
    }

    await this.prisma.passwordRecovery.updateMany({
      where: {
        userId: user.id,
      },
      data: {
        status: RecoveryStatusEnum.DEACTIVATED,
      },
    })

    const passwordRecovery = await this.prisma.passwordRecovery.create({
      data: {
        userId: user.id,
        token: randomUUID(),
        expiresAt: addDays(new Date(), 1),
        status: RecoveryStatusEnum.PENDING,
      },
    })

    await this.emailService.sendRecoveryPasswordTempCode({
      email,
      userName: user.name,
      token: passwordRecovery.token,
    })
  }
}
