import { IsOptional, IsNumber } from 'class-validator'
import { Transform, type TransformFnParams } from 'class-transformer'

export class QueryDto {
  @IsOptional()
  @IsNumber()
  cursor?: number

  @Transform((params: TransformFnParams) => parseInt(params.value))
  pageSize?: number
}
