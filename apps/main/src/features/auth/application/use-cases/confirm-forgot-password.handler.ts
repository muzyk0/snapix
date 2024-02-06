import { BadRequestException } from '@nestjs/common'
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '@app/prisma'
import { RecoveryStatusEnum } from '../../types/recovery-status.enum'
import { CryptService } from '../services/crypt.service'
import { isAfter } from 'date-fns'
import { isNil } from 'lodash'

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

    const lastPasswordChange = await this.prisma.passwordHistory.findFirst({
      where: {
        userId: recovery.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // todo: Write e2e tests for this
    // todo: history of password changes?
    // todo: When user several times change password in a row, it should not be allowed?
    if (
      !isNil(lastPasswordChange) &&
      !isNil(lastPasswordChange.createdAt) &&
      isAfter(lastPasswordChange.createdAt, new Date())
    ) {
      throw new BadRequestException({
        password: {
          message: 'Password has been changed recently, please try again later',
          property: 'password',
        },
      })
    }

    const passwordHash = await this.cryptService.hashPassword(password)

    await this.prisma.passwordRecovery.update({
      where: {
        id: recovery.id,
      },
      data: {
        status: RecoveryStatusEnum.CONFIRMED,
        user: {
          update: {
            password: passwordHash,
            passwordHistory: {
              create: {
                password: passwordHash,
              },
            },
          },
        },
      },
      include: {
        user: true,
      },
    })
  }
}
