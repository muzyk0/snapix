import { IsInt, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class UserIdParamDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  userId!: number
}
