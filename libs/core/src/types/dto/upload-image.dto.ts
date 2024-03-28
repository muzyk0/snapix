import { IsArray, IsNotEmpty, IsNotEmptyObject, IsOptional, IsString } from 'class-validator'
import { StorageFileTypeEnum } from '../../enums/storage-command.enum'

class FileDto {
  @IsNotEmpty()
  buffer!: Buffer

  @IsString()
  mimetype!: string

  @IsString()
  originalname!: string
}

export class UploadImageDto {
  @IsString()
  ownerId!: string

  @IsString()
  type!: StorageFileTypeEnum

  @IsNotEmptyObject()
  file!: FileDto

  @IsOptional()
  @IsArray()
  resolutions?: {
    width: number
    height: number
  }[]
}
