import { IsOptional, IsNumber } from 'class-validator'

export class QueryDto {
  @IsOptional()
  @IsNumber()
  cursor?: number

  @IsOptional()
  @IsNumber()
  pageSize?: number
}
