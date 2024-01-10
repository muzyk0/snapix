import { Injectable } from '@nestjs/common'
import { type AuditLogServiceAbstract } from '@app/core/audit-log/audit-log-service.abstract'
import { type CreateAuditLogDto } from '@app/core/audit-log/dto/create-audit-log.dto'
import { type AuditLogEntity } from '@app/core/audit-log/dto/audit-log.entity'
import { PrismaService } from '@app/prisma'

@Injectable()
export class AuditLogService implements AuditLogServiceAbstract {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAuditLogDto): Promise<AuditLogEntity> {
    return await this.prisma.auditLog.create({
      data,
    })
  }
}
