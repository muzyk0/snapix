import { type CreateAuditLogDto } from './dto/create-audit-log.dto'
import { type AuditLogEntity } from '@app/core/audit-log/dto/audit-log.entity'

export abstract class AuditLogServiceAbstract {
  abstract create(data: CreateAuditLogDto): Promise<AuditLogEntity>
}
