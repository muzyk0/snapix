import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IsDate, IsNotEmpty, Length, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { MinAge } from '../../decorators/min-age.decorator'
import { PrismaService } from '@app/prisma'

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
  })
  @Matches(/^\d{2}\.\d{2}\.\d{4}$/)
  @IsDate()
  @MinAge(13, { message: 'User must be at least 13 years old' })
  birthDate: string

  @ApiProperty({
    pattern: '^[a-zA-Zа-яА-Я\\s\\-]+$',
  })
  @Matches(/^[a-zA-Zа-яА-Я\s-]+$/)
  city: string

  @ApiProperty({
    maxLength: 200,
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,20}$',
  })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/)
  aboutMe: string

  userId: number

  constructor(
    userName: string,
    firstName: string,
    lastName: string,
    birthDate: string,
    city: string,
    aboutMe: string,
    userId: number,
    name: string
  ) {
    this.userName = userName ?? name
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
    const profile = await this.prisma.profile.findFirst({
      where: {
        userId: dto.userId,
      },
    })
    await this.prisma.profile.update({
      where: {
        id: profile?.id,
      },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        birthDate: dto.birthDate,
        city: dto.city,
        aboutMe: dto.aboutMe,
        user: {
          update: {
            name: dto.userName,
          },
        },
      },
    })
  }
}
