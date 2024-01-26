import { IsEnum, IsString } from 'class-validator'
import { CONFIRMATION_STATUS } from '../../types/confirm-status.enum'
import { ApiProperty } from '@nestjs/swagger'

export class ConfirmRegisterDto {
  @IsString()
  message!: string

  @IsEnum(CONFIRMATION_STATUS)
  status!: CONFIRMATION_STATUS
}

export class ConfirmRegisterSwaggerDto {
  @ApiProperty({ description: 'Validation description', example: 'Not found' })
  message!: string

  @ApiProperty({
    description: `Validation enum status 
      \n\n0 - OK 
      \n\n1 - CONFIRMED 
      \n\n2 - EXPIRED 
      \n\n3 - BAD_TOKEN
      `,
    enum: CONFIRMATION_STATUS,
  })
  status!: CONFIRMATION_STATUS
}
