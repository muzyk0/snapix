import { Controller, Get } from '@nestjs/common'
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus'
import { PrismaService } from '@app/prisma'
import { ApiTags } from '@nestjs/swagger'
import { Public } from '../auth'

@ApiTags('HealthCheck')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly db: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
    private readonly memory: MemoryHealthIndicator
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      async () => this.http.pingCheck('google', 'https://www.google.com'),
      async () => this.db.pingCheck('database', this.prisma),
      async () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ])
  }
}
