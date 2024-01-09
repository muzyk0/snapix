import { IsDateString, IsEnum, IsJSON, IsString } from 'class-validator'

export enum AuditCode {
  ERROR = 0,
}

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
