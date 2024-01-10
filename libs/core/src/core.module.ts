import { Module } from '@nestjs/common'
import { CoreService } from './core.service'
import { HealthModule } from './health/health.module'

@Module({
  imports: [HealthModule],
  providers: [CoreService],
  exports: [CoreService, HealthModule],
})
export class CoreModule {}
