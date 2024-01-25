import { BadRequestException, NotFoundException } from '@nestjs/common'
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { isAfter } from 'date-fns'
import { PrismaService } from '@app/prisma'
import { type User } from '@prisma/client'
import { type UserWithConfirmation } from '../../../users/types'
import { type ConfirmRegisterDto } from '../dto/confirm-register.dto'
import { CONFIRMATION_STATUS } from '../../types/confirm-status.enum'
import { IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ConfirmRegisterCommand {
  @ApiProperty({
    description: 'Confirm registration uuid token',
    format: 'uuid',
  })
  @IsUUID()
  token!: string

  constructor(token: string) {
    this.token = token
  }
}

@CommandHandler(ConfirmRegisterCommand)
export class ConfirmRegisterHandler implements ICommandHandler<ConfirmRegisterCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ token }: ConfirmRegisterCommand): Promise<ConfirmRegisterDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        emailConfirmation: {
          token,
        },
      },
      include: {
        emailConfirmation: true,
      },
    })

    if (!this.checkAvailableConfirmAccount(user as UserWithConfirmation)) {
      throw new BadRequestException([{ message: "Code isn't correct", field: 'code' }])
    }

    return {
      message: 'OK',
      status: CONFIRMATION_STATUS.OK,
    }
  }

  private checkAvailableConfirmAccount(user: UserWithConfirmation) {
    if (user === null) {
      throw new NotFoundException({
        message: 'Not found',
        status: CONFIRMATION_STATUS.BAD_TOKEN,
      })
    }
    if (this.isConfirmed(user)) {
      throw new NotFoundException({
        message: 'Not found',
        status: CONFIRMATION_STATUS.CONFIRMED,
      })
    }

    if (this.isExpired(user)) {
      throw new NotFoundException({
        message: 'Not found',
        status: CONFIRMATION_STATUS.EXPIRED,
      })
    }

    return true
  }

  private isConfirmed(user: User) {
    return user.emailConfirmed !== null
  }

  private isExpired(user: UserWithConfirmation) {
    if (user.emailConfirmation !== null && isAfter(new Date(), user.emailConfirmation.expiresIn)) {
      return false
    }
    return true
  }
}
