import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test'
  DATABASE_URL: string
  PORT: number
  npm_package_version: string
  GLOBAL_PREFIX: string
  RMQ_URLS: string
  ACCESS_TOKEN_SECRET: string
  ACCESS_TOKEN_SECRET_EXPIRES_IN: string
  REFRESH_TOKEN_SECRET: string
  REFRESH_TOKEN_SECRET_EXPIRES_IN: string
  EMAIL_CONFIRM_REGISTER_LINK: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  GOOGLE_CALLBACK_URL: string
  GOOGLE_REDIRECT_URL: string
  NEW_RELIC_LICENSE_KEY: string
  SHADOW_DATABASE_URL: string
  AWS_ACCESS_KEY_ID: string
  AWS_SECRET_ACCESS_KEY: string
  STORAGE_SERVICE_HOST: string
  STORAGE_SERVICE_PORT: number
  STORAGE_SERVICE_MONGO_DB: string
}

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<EnvironmentVariables>) {}

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

  get globalPrefix(): string {
    return this.configService.get('GLOBAL_PREFIX', 'api/v1')
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

  get storageService(): {
    host: string
    port: number
  } {
    return {
      host: this.configService.get('STORAGE_SERVICE_HOST') ?? '',
      port: this.configService.get('STORAGE_SERVICE_PORT', 3247, { infer: true }),
    }
  }

  get mongoDbOptions(): {
    uri: string
  } {
    return {
      uri: this.configService.get('STORAGE_SERVICE_MONGO_DB', ''),
    }
  }
}
