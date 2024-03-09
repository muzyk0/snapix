import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateProfileDto {
  @ApiProperty({
    pattern: '^[a-zA-Z0-9_-]+$',
    minLength: 6,
    maxLength: 30,
    required: true,
    example: 'John009',
  })
  @Length(6, 30)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/)
  userName!: string

  @ApiProperty({
    pattern: '^[a-zA-Zа-яА-Я]+$',
    minLength: 1,
    maxLength: 50,
    required: true,
    example: 'John',
  })
  @Length(1, 50)
  @IsNotEmpty()
  @Matches(/^([a-zA-Zа-яА-Я]+)$/)
  firstName!: string

  @ApiProperty({
    pattern: '^[a-zA-Zа-яА-Я]+$',
    minLength: 1,
    maxLength: 50,
    required: true,
    example: 'Carter',
  })
  @Length(1, 50)
  @IsNotEmpty()
  @Matches(/^([a-zA-Zа-яА-Я]+)$/)
  lastName!: string

  @ApiProperty({
    pattern: '/^\\d{2}\\.\\d{2}\\.\\d{4}$/',
    example: '10.12.2000',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}\.\d{2}\.\d{4}$/, { message: 'Invalid date format. Please use dd.mm.yyyy' })
  birthDate?: string

  @ApiProperty({
    pattern: '^[a-zA-Zа-яА-Я\\s-]+$',
    required: false,
    example: 'Paris',
  })
  @IsOptional()
  @Matches(/^[a-zA-Zа-яА-Я\s-]+$/)
  city?: string

  @ApiProperty({
    pattern: '^[0-9a-zA-Zа-яА-Я\\s!,.?":;\'\\-()/=+*&%$#@^<>[\\]{}|~`€£¥§]+$',
    example: 'A good man from the amazing city of Paris!',
    maxLength: 200,
    required: false,
  })
  @IsOptional()
  @Length(0, 200)
  @IsString()
  @Matches(/^[0-9a-zA-Zа-яА-Я\s!,.?":;'\-()/=+*&%$#@^<>[\]{}|~`€£¥§]+$/)
  aboutMe?: string
}
