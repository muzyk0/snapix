import { IsInt, IsOptional, IsString } from 'class-validator'

export class PublicProfileViewDto {
  @IsInt()
  id!: number

  @IsString()
  userName!: string

  @IsOptional()
  @IsString()
  aboutMe!: string | null
}
