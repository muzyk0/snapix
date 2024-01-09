import { Module } from '@nestjs/common'
import { AuditLogServiceAbstract } from '@app/core/audit-log/audit-log-service.abstract'
import { AuditLogService } from './audit-log.service'

@Module({
  providers: [
    {
      provide: AuditLogServiceAbstract,
      useClass: AuditLogService,
    },
  ],
  exports: [
    {
      provide: AuditLogServiceAbstract,
      useClass: AuditLogService,
    },
  ],
})
export class AuditLogModule {}
