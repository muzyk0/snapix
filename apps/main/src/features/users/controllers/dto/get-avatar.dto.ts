import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class GetAvatarDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @Expose()
  userId!: string
}
