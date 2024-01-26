import { IsString } from 'class-validator'

export class SendPassRecoveryEmailCodeDto {
  @IsString()
  email!: string

  @IsString()
  userName!: string

  @IsString()
  recoveryCode!: string
}
