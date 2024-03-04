import { Module } from '@nestjs/common'
import { MainController } from './main.controller'
import { MainService } from './main.service'
import { ConfigModule } from '@nestjs/config'
import { AppConfigModule } from '@app/config'
import { UsersModule } from './features/users/users.module'
import { PrismaModule } from '@app/prisma'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { AuditLogModule } from './features/audit-log/audit-log.module'
import { AuthModule, JwtAuthGuard } from './features/auth'
import { NotificationModule } from './features/notification/notification.module'
import { ErrorExceptionFilter } from './exception-filters/error-exception.filter'
import { HttpExceptionFilter } from './exception-filters/http-exception-filter.'
import { ValidationExceptionFilter } from './exception-filters/validation-exception.filter'
import { HealthModule } from './features/health/health.module'
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n'
import * as path from 'path'
import { ProfileModule } from './features/profile/profile.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.test'],
    }),

    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: true,
        },
        logging: true,
        typesOutputPath: path
          .join(__dirname, './src/generated/i18n.generated.ts')
          .replace(/dist[\\|/]/, '')
          .replace(/src[\\|/]src[\\|/]/, '')
          .replace(/src[\\|/]/, ''),
      }),
      resolvers: [new HeaderResolver(['x-lang']), AcceptLanguageResolver],
      inject: [],
    }),
    AppConfigModule,
    UsersModule,
    PrismaModule,
    AuditLogModule,
    HealthModule,
    AuthModule,
    NotificationModule,
    ProfileModule,
  ],
  controllers: [MainController],
  providers: [
    MainService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
  ],
})
export class MainModule {}
