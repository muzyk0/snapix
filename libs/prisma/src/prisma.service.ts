import { Injectable, type OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { AppConfigService } from '@app/config'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(appConfigService: AppConfigService) {
    super({
      datasourceUrl: appConfigService.datasourceUrl,
    })
  }

  async onModuleInit() {
    // Note: this is optional
    await this.$connect()
  }
}
