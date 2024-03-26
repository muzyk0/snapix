import { IsNotEmpty, IsString } from 'class-validator'
import { StorageFileTypeEnum } from '../../enums/storage-command.enum'

export class UploadFileDto {
  @IsString()
  ownerId!: string

  @IsString()
  type!: StorageFileTypeEnum

  @IsNotEmpty()
  buffer!: Buffer

  @IsString()
  mimetype!: string

  @IsString()
  originalname!: string
}
