import { IsNotEmpty, IsString } from 'class-validator'
import { type User } from '@prisma/client'

export class UploadAvatarDto {
  @IsString()
  userId!: User['id']

  @IsNotEmpty()
  buffer!: Buffer

  @IsString()
  mimetype!: string

  @IsString()
  originalname!: string
}
