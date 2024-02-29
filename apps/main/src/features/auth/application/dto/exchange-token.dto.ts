import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ExchangeTokenDto {
  @ApiProperty({
    type: 'string',
  })
  @IsString()
  token!: string
}
