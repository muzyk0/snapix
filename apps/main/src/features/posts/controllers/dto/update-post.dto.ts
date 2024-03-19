import { IsOptional, IsString, Length, Matches } from 'class-validator'

export class UpdatePostDto {
  @IsOptional()
  @Length(0, 2000)
  @IsString()
  @Matches(/^[0-9a-zA-Zа-яА-Я\s!,.?":;'\-()/=+*&%$#@^<>[\]{}|~`€£¥§]+$/)
  content?: string
}
