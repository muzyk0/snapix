import { IsNotEmpty, IsString } from 'class-validator'

export class UploadAvatarDto {
  @IsNotEmpty()
  buffer!: Buffer

  @IsString()
  mimetype!: string

  @IsString()
  originalname!: string
}
