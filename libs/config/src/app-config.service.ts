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

  get accessTokenSecret(): string {
    return this.configService.getOrThrow('ACCESS_TOKEN_SECRET')
  }

  get accessTokenSecretExpiresIn(): string {
    return this.configService.get('ACCESS_TOKEN_SECRET_EXPIRES_IN') ?? '15m'
  }

  get refreshTokenSecret(): string {
    return this.configService.get('REFRESH_TOKEN_SECRET') ?? '2783h789rdhj289dhj9fhsdyiuhf78oy12df'
  }

  get refreshTokenSecretExpiresIn(): string {
    return this.configService.get('REFRESH_TOKEN_SECRET_EXPIRES_IN') ?? '1d'
  }

  get googleOAuthConfig(): {
    clientID?: string
    clientSecret?: string
    callbackURL?: string
  } {
    return {
      clientID: this.configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: this.configService.get('GOOGLE_CALLBACK_URL'),
    }
  }

  get s3Config(): {
    accessKeyId: string
    secretAccessKey: string
  } {
    return {
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') ?? '',
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') ?? '',
    }
  }
}
