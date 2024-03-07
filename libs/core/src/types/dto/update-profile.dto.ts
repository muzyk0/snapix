import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator'

export class UpdateProfileDto {
  @ApiProperty({
    minLength: 6,
    maxLength: 30,
    pattern: '^[a-zA-Z0-9_-]+$',
  })
  @Length(6, 30)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/)
  userName!: string

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
  @IsString()
  @Matches(/^\d{2}\.\d{2}\.\d{4}$/, { message: 'Invalid date format. Please use dd.mm.yyyy' })
  birthDate?: string

  @ApiProperty({
    pattern: '^[a-zA-Zа-яА-Я\\s\\-]+$',
  })
  @IsOptional()
  @Matches(/^[a-zA-Zа-яА-Я\s-]+$/)
  city?: string

  @ApiProperty({
    maxLength: 200,
    pattern:
      '/^[0-9a-zA-Zа-яА-Я\\s!,.?":;\'\\-()/=+*&%$#@^<>[\\]{}|~`€£¥§]+$/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$',
  })
  @IsOptional()
  @Length(0, 200)
  @IsString()
  @Matches(/^[0-9a-zA-Zа-яА-Я\s!,.?":;'\-()/=+*&%$#@^<>[\]{}|~`€£¥§]+$/)
  aboutMe?: string
}
