import { IsNotEmpty, IsUUID, Length, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class NewPasswordDto {
  @ApiProperty({
    minLength: 6,
    maxLength: 20,
    pattern: '/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~]).*/',
  })
  @Length(6, 20)
  @IsNotEmpty()
  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{6,20}$/)
  password!: string

  @ApiProperty({
    type: 'IsUUID',
  })
  @IsUUID()
  token!: string
}
