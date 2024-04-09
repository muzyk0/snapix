import { IsInt, IsOptional, IsString } from 'class-validator'

export class MyProfileViewDto {
  @IsInt()
  id!: number

  @IsString()
  userName!: string

  @IsOptional()
  @IsString()
  firstName!: string | null

  @IsOptional()
  @IsString()
  lastName!: string | null

  @IsOptional()
  @IsString()
  birthDate!: string | null

  @IsOptional()
  @IsString()
  city!: string | null

  @IsOptional()
  @IsString()
  aboutMe!: string | null

  @IsOptional()
  @IsString()
  lastUpdate!: Date
}
