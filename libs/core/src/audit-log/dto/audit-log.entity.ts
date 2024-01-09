import { IsDate, IsEnum, IsJSON, IsOptional, IsString } from 'class-validator'
import { type AuditLog } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'

export enum AuditCode {
  ERROR = 0,
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
}
