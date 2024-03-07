import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PrismaService } from '@app/prisma'
import { HttpException, HttpStatus } from '@nestjs/common'

export class FillOutProfileCommand {
  @ApiProperty({
    minLength: 6,
    maxLength: 30,
    pattern: '^[a-zA-Z0-9_-]+$',
  })
  @Length(6, 30)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/)
  userName: string

  @ApiProperty({
    minLength: 1,
    maxLength: 50,
    pattern: '^([a-zA-Zа-яА-Я]+)$',
  })
  @Length(1, 50)
  @IsNotEmpty()
  @Matches(/^([a-zA-Zа-яА-Я]+)$/)
  firstName!: string

  @ApiProperty({
    minLength: 1,
    maxLength: 50,
    pattern: '^([a-zA-Zа-яА-Я]+)$',
  })
  @Length(1, 50)
  @IsNotEmpty()
  @Matches(/^([a-zA-Zа-яА-Я]+)$/)
  lastName!: string

  @ApiProperty({
    pattern: '^\\d{2}\\.\\d{2}\\.\\d{4}$',
    type: String,
  })
  @IsOptional()
  @Matches(/^\d{2}\.\d{2}\.\d{4}$/, { message: 'Invalid date format. Please use dd.mm.yyyy' })
  @IsString()
  birthDate: string

  @ApiProperty({
    pattern: '^[a-zA-Zа-яА-Я\\s\\-]+$',
  })
  @IsOptional()
  @Matches(/^[a-zA-Zа-яА-Я\s-]+$/)
  city: string

  @ApiProperty({
    maxLength: 200,
    pattern:
      '/^[0-9a-zA-Zа-яА-Я\\s!,.?":;\'\\-()/=+*&%$#@^<>[\\]{}|~`€£¥§]+$/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$',
  })
  @IsOptional()
  @Length(0, 200)
  @IsString()
  @Matches(/^[0-9a-zA-Zа-яА-Я\s!,.?":;'\-()/=+*&%$#@^<>[\]{}|~`€£¥§]+$/)
  aboutMe: string

  userId: number

  constructor(
    userName: string,
    firstName: string,
    lastName: string,
    birthDate: string,
    city: string,
    aboutMe: string,
    userId: number
  ) {
    this.userName = userName
    this.firstName = firstName
    this.lastName = lastName
    this.birthDate = birthDate
    this.city = city
    this.aboutMe = aboutMe
    this.userId = userId
  }
}

@CommandHandler(FillOutProfileCommand)
export class FillOutProfileHandler implements ICommandHandler<FillOutProfileCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: FillOutProfileCommand) {
    let birthDate: Date | null
    if (!dto.birthDate) {
      birthDate = null
    } else {
      birthDate = new Date(new Date(dto.birthDate).toLocaleDateString('en-GB'))
    }

    try {
      await this.prisma.user.update({
        where: {
          id: dto.userId,
        },
        data: {
          name: dto.userName,
          profile: {
            update: {
              firstName: dto.firstName,
              lastName: dto.lastName,
              birthDate,
              city: dto.city,
              aboutMe: dto.aboutMe,
            },
          },
        },
      })
      return { message: 'Profile updated successfully' }
    } catch (error) {
      throw new HttpException('Error updating profile', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
