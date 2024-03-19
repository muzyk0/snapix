import { IsNotEmpty, IsString } from 'class-validator'

export class UploadFileDto {
  @IsString()
  ownerId!: string

  @IsNotEmpty()
  buffer!: Buffer

  @IsString()
  mimetype!: string

  @IsString()
  originalname!: string
}
