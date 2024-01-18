import { IsDateString, IsEnum, IsJSON, IsString } from 'class-validator'
import { AuditCode } from '@app/core/audit-log/dto/audit-log.entity'

export class CreateAuditLogDto {
  @IsEnum(AuditCode)
  code!: number

  @IsString()
  message!: string

  @IsDateString()
  timestamp!: string

  @IsJSON()
  extraData!: string
}
