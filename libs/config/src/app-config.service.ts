import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get isDev(): boolean {
    return this.configService.get('NODE_ENV') === 'development'
  }

  get datasourceUrl(): string | undefined {
    return this.configService.get('DATABASE_URL')
  }

  get port(): number {
    return this.configService.get('PORT', { infer: true }) ?? 3000
  }

  get appVersion(): string | null {
    return this.configService.get('npm_package_version') ?? null
  }

  get globalPrefix(): string | null {
    return this.configService.get('GLOBAL_PREFIX') ?? null
  }

  get rmqUrls(): string[] {
    return this.configService.get('RMQ_URLS').split(', ') ?? []
  }
}
