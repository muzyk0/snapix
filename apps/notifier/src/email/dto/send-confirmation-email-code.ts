import { IsString } from 'class-validator'

export class SendConfirmationEmailCodeDto {
  @IsString()
  email!: string

  @IsString()
  userName!: string

  @IsString()
  confirmationCode!: string
}
