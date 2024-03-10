import { Module } from '@nestjs/common'
import { MainController } from './main.controller'
import { MainService } from './main.service'
import { ConfigModule } from '@nestjs/config'
import { AppConfigModule, AppConfigService } from '@app/config'
import { UsersModule } from './features/users/users.module'
import { PrismaModule } from '@app/prisma'
import { APP_FILTER } from '@nestjs/core'
import { AuditLogModule } from './features/audit-log/audit-log.module'
import { AuthModule } from './features/auth'
import { NotificationModule } from './features/notification/notification.module'
import { ErrorExceptionFilter } from './exception-filters/error-exception.filter'
import { HttpExceptionFilter } from './exception-filters/http-exception-filter.'
import { ValidationExceptionFilter } from './exception-filters/validation-exception.filter'
import { HealthModule } from './features/health/health.module'
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n'
import * as path from 'path'
import { ClientsModule, type TcpClientOptions, Transport } from '@nestjs/microservices'
import { ServicesEnum } from '@app/core/constants'
import { PostsModule } from './features/posts/posts.module'

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

    ClientsModule.registerAsync([
      {
        name: ServicesEnum.STORAGE_SERVICE,
        imports: [AppConfigModule],
        useFactory: (configService: AppConfigService) => {
          return {
            transport: Transport.TCP,
            options: {
              host: configService.storageService.host,
              port: configService.storageService.port,
            },
          } satisfies TcpClientOptions
        },
        inject: [AppConfigService],
      },
    ]),

    AppConfigModule,
    UsersModule,
    PrismaModule,
    AuditLogModule,
    HealthModule,
    AuthModule,
    NotificationModule,
    PostsModule,
  ],
  controllers: [MainController],
  providers: [
    MainService,
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
