import { IsArray, IsNumber, IsString, IsUrl, Max, Min, ValidateNested } from 'class-validator'

export class ImageFileInfo {
  @IsUrl()
  url!: string

  @IsNumber()
  @Min(1)
  @Max(4096)
  width!: number

  @IsNumber()
  @Min(1)
  @Max(4096)
  height!: number

  @IsNumber()
  @Min(1)
  size!: number
}

export class UploadFilesOutputDto {
  @IsString()
  referenceId!: string

  @IsArray()
  @ValidateNested({ each: true })
  files!: ImageFileInfo[]
}

export class UploadFilesViewDto {
  @IsArray()
  @ValidateNested({ each: true })
  files!: ImageFileInfo[]
}
