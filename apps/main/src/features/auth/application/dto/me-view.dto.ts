import { ApiProperty } from '@nestjs/swagger'

export class MeViewDto {
  @ApiProperty({
    example: 1,
  })
  userId!: number

  @ApiProperty({
    example: 'John Doe',
  })
  username!: string

  @ApiProperty({
    example: 'JohnDoe@example.com',
  })
  email!: string
}
