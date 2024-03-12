import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator'
import { type ImageFileInfo } from '@app/core/types/dto'

export class UploadPhotoForPostViewDto {
  @IsNotEmpty()
  id!: string

  @IsArray()
  @ValidateNested({ each: true })
  files!: ImageFileInfo[]
}
