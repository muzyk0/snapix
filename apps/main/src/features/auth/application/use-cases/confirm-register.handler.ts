import { BadRequestException } from '@nestjs/common'
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { isBefore } from 'date-fns'
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
    const where = {
      emailConfirmation: {
        token,
      },
    }
    const include = {
      emailConfirmation: true,
    }
    const user = await this.prisma.user.findFirst({
      where,
      include,
    })

    this.checkAvailableConfirmAccount(user as UserWithConfirmation)

    if (user !== null) {
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailConfirmed: new Date(),
          emailConfirmation: {
            update: {
              isConfirmed: true,
            },
          },
        },
        include,
      })
    }

    return {
      message: 'OK',
      status: CONFIRMATION_STATUS.OK,
    }
  }

  private checkAvailableConfirmAccount(user: UserWithConfirmation): void {
    if (user === null) {
      throw new BadRequestException({
        token: {
          message: CONFIRMATION_STATUS.BAD_TOKEN,
          property: 'token',
        },
      })
    }
    if (this.isConfirmed(user)) {
      throw new BadRequestException({
        token: {
          message: CONFIRMATION_STATUS.CONFIRMED,
          property: 'token',
        },
      })
    }

    if (this.isExpired(user)) {
      throw new BadRequestException({
        token: {
          message: CONFIRMATION_STATUS.EXPIRED,
          property: 'token',
        },
      })
    }
  }

  private isConfirmed(user: User) {
    return user.emailConfirmed !== null
  }

  private isExpired(user: UserWithConfirmation) {
    if (user.emailConfirmation !== null && isBefore(new Date(), user.emailConfirmation.expiresAt)) {
      return false
    }
    return true
  }
}
