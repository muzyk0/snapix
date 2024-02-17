import { BadRequestException, NotFoundException } from '@nestjs/common'
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { isAfter } from 'date-fns'
import { PrismaService } from '@app/prisma'
import { type ConfirmRegisterDto } from '../dto/confirm-register.dto'
import { CONFIRMATION_STATUS } from '../../types/confirm-status.enum'
import { IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class VerifyConfirmationTokenQuery {
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

@QueryHandler(VerifyConfirmationTokenQuery)
export class VerifyConfirmationTokenHandler implements IQueryHandler<VerifyConfirmationTokenQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ token }: VerifyConfirmationTokenQuery): Promise<ConfirmRegisterDto> {
    const emailConfirmation = await this.prisma.emailConfirmation.findFirst({
      where: {
        token,
      },
    })

    if (!emailConfirmation) {
      throw new NotFoundException({
        message: 'Token not found',
      })
    }

    if (emailConfirmation?.isConfirmed) {
      throw new BadRequestException({
        token: {
          message: CONFIRMATION_STATUS.CONFIRMED,
          property: 'token',
        },
      })
    }

    if (isAfter(new Date(), emailConfirmation.expiresAt)) {
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
