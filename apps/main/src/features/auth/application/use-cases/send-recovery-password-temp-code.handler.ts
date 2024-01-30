import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { NotificationService } from '../../../notification/services/notification.service'
import { PrismaService } from '@app/prisma'
import { BadRequestException } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { addDays } from 'date-fns'
import { RecoveryStatusEnum } from '../../types/recovery-status.enum'

export class SendRecoveryPasswordTempCodeCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(SendRecoveryPasswordTempCodeCommand)
export class SendRecoveryPasswordTempCodeHandler
  implements ICommandHandler<SendRecoveryPasswordTempCodeCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: NotificationService
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
          message: "User with this email doesn't exist",
          property: 'email',
        },
      })
    }

    const passwordRecovery = await this.prisma.passwordRecovery.create({
      data: {
        userId: user.id,
        token: randomUUID(),
        expiresAt: addDays(new Date(), 1),
        status: RecoveryStatusEnum.PENDING,
      },
    })

    await this.prisma.passwordRecovery.updateMany({
      data: {
        userId: user.id,
        status: RecoveryStatusEnum.DEACTIVATED,
      },
    })

    await this.emailService.sendRecoveryPasswordTempCode({
      email,
      userName: user.name,
      recoveryCode: passwordRecovery.token,
    })
  }
}
