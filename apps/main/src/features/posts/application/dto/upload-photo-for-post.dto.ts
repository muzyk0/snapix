import { IsNotEmpty } from 'class-validator'

export class UploadPhotoForPostDto {
  @IsNotEmpty()
  buffer!: Buffer

  @IsNotEmpty()
  mimetype!: string

  @IsNotEmpty()
  originalname!: string
}
