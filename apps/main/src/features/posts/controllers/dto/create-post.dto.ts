import { IsOptional, IsString, Length, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePostDto {
  @ApiProperty({
    pattern: '^[0-9a-zA-Zа-яА-Я\\s!,.?":;\'\\-()/=+*&%$#@^<>[\\]{}|~`€£¥§]+$',
    example: 'Anything that can go wrong will go wrong!',
    maxLength: 2000,
    required: false,
  })
  @IsOptional()
  @Length(0, 2000)
  @IsString()
  @Matches(/^[0-9a-zA-Zа-яА-Я\s!,.?":;'\-()/=+*&%$#@^<>[\]{}|~`€£¥§]+$/)
  content?: string

  @ApiProperty({
    example: 'photoId',
    required: true,
  })
  @IsString()
  photoId!: string
}
