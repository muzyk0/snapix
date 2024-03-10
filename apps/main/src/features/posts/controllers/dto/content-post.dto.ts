import { IsOptional, IsString, Length, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ContentPostDto {
  @ApiProperty({
    pattern: '^[0-9a-zA-Zа-яА-Я\\s!,.?":;\'\\-()/=+*&%$#@^<>[\\]{}|~`€£¥§]+$',
    example: 'Anything that can go wrong will go wrong!',
    maxLength: 2000,
    required: false,
  })
  @IsOptional()
  @Length(2000)
  @IsString()
  @Matches(/^[0-9a-zA-Zа-яА-Я\s!,.?":;'\-()/=+*&%$#@^<>[\]{}|~`€£¥§]+$/)
  content?: string
}
