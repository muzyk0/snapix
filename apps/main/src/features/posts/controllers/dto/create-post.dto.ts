import { IsOptional, IsString, Length, Matches } from 'class-validator'

export class CreatePostDto {
  @IsOptional()
  @Length(0, 2000)
  @IsString()
  @Matches(/^[0-9a-zA-Zа-яА-Я\s!,.?":;'\-()/=+*&%$#@^<>[\]{}|~`€£¥§]+$/)
  content?: string

  @IsString()
  imageId!: string
}
