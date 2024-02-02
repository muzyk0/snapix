import { BadRequestException } from '@nestjs/common'
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '@app/prisma'
import { RecoveryStatusEnum } from '../../types/recovery-status.enum'
import { CryptService } from '../services/crypt.service'

export class ConfirmForgotPasswordCommand {
  constructor(
    public readonly token: string,
    public readonly password: string
  ) {}
}

@CommandHandler(ConfirmForgotPasswordCommand)
export class ConfirmForgotPasswordHandler implements ICommandHandler<ConfirmForgotPasswordCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptService: CryptService
  ) {}

  async execute({ token, password }: ConfirmForgotPasswordCommand): Promise<void> {
    const recovery = await this.prisma.passwordRecovery.findUnique({
      where: {
        token,
        status: RecoveryStatusEnum.PENDING,
      },
    })

    if (recovery === null) {
      throw new BadRequestException({
        token: {
          message: 'Invalid token',
          property: 'token',
        },
      })
    }

    if (recovery.expiresAt < new Date()) {
      throw new BadRequestException({
        token: {
          message: 'Token expired',
          property: 'token',
        },
      })
    }

    await this.prisma.passwordRecovery.update({
      where: {
        id: recovery.id,
      },
      data: {
        status: RecoveryStatusEnum.CONFIRMED,
        user: {
          update: {
            password: await this.cryptService.hashPassword(password),
          },
        },
      },
      include: {
        user: true,
      },
    })
  }
}
