import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator'

export class UpdateProfileDto {
  @Length(6, 30)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/)
  userName!: string

  @Length(1, 50)
  @IsNotEmpty()
  @Matches(/^([a-zA-Zа-яА-Я]+)$/)
  firstName!: string

  @Length(1, 50)
  @IsNotEmpty()
  @Matches(/^([a-zA-Zа-яА-Я]+)$/)
  lastName!: string

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}\.\d{2}\.\d{4}$/, { message: 'Invalid date format. Please use dd.mm.yyyy' })
  birthDate?: string

  @IsOptional()
  @Matches(/^[a-zA-Zа-яА-Я\s-]+$/)
  city?: string

  @IsOptional()
  @Length(0, 200)
  @IsString()
  @Matches(/^[0-9a-zA-Zа-яА-Я\s!,.?":;'\-()/=+*&%$#@^<>[\]{}|~`€£¥§]+$/)
  aboutMe?: string
}
