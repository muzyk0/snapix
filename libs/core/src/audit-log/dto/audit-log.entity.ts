import { IsDate, IsEnum, IsJSON, IsOptional, IsString } from 'class-validator'
import { type AuditLog } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'

export enum AuditCode {
  SERVER_ERROR = 0,
  HTTP_ERROR = 1,
  VALIDATION_ERROR = 2,
}

export class AuditLogEntity implements AuditLog {
  @IsString()
  id!: number

  @IsEnum(AuditCode)
  code!: number

  @IsOptional()
  @IsString()
  message!: string

  @IsOptional()
  @IsDate()
  timestamp!: Date

  @IsOptional()
  @IsJSON()
  extraData!: JsonValue

  @IsOptional()
  createdAt!: Date

  @IsOptional()
  updatedAt!: Date
}
