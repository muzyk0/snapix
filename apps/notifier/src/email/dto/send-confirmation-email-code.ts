import { IsString } from 'class-validator'

export class SendEmailDto {
  @IsString()
  email!: string

  @IsString()
  userName!: string

  @IsString()
  token!: string
}
