import { BadRequestException, NotFoundException } from '@nestjs/common'
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { isAfter } from 'date-fns'
import { PrismaService } from '@app/prisma'
import { type ConfirmRegisterDto } from '../dto/confirm-register.dto'
import { CONFIRMATION_STATUS } from '../../types/confirm-status.enum'
import { IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class VerifyForgotPasswordTokenQuery {
  @ApiProperty({
    description: 'uuid token',
    format: 'uuid',
  })
  @IsUUID()
  token!: string

  constructor(token: string) {
    this.token = token
  }
}

@QueryHandler(VerifyForgotPasswordTokenQuery)
export class VerifyForgotPasswordTokenHandler
  implements IQueryHandler<VerifyForgotPasswordTokenQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ token }: VerifyForgotPasswordTokenQuery): Promise<ConfirmRegisterDto> {
    const passwordRecovery = await this.prisma.passwordRecovery.findFirst({
      where: {
        token,
      },
    })

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!passwordRecovery) {
      throw new NotFoundException({
        message: 'Token not found',
      })
    }

    if (passwordRecovery?.status !== CONFIRMATION_STATUS.OK) {
      throw new BadRequestException({
        token: {
          message: CONFIRMATION_STATUS.CONFIRMED,
          property: 'token',
        },
      })
    }

    if (isAfter(new Date(), passwordRecovery.expiresAt)) {
      throw new BadRequestException({
        token: {
          message: CONFIRMATION_STATUS.EXPIRED,
          property: 'token',
        },
      })
    }

    return {
      message: 'OK',
      status: CONFIRMATION_STATUS.OK,
    }
  }
}
