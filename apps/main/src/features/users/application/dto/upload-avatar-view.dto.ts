import { IsArray, ValidateNested, IsNumber, Min, Max, IsUrl } from 'class-validator'

export class AvatarInfo {
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

export class UploadAvatarViewDto {
  @IsArray()
  @ValidateNested({ each: true })
  avatars!: AvatarInfo[]
}
