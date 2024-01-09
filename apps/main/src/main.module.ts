import { Module } from '@nestjs/common'
import { MainController } from './main.controller'
import { MainService } from './main.service'
import { ConfigModule } from '@nestjs/config'
import { AppConfigModule } from '@app/config'
import { UsersModule } from './features/users/users.module'
import { PrismaModule } from '@app/prisma'
import { APP_FILTER } from '@nestjs/core'
import { ErrorExceptionFilter } from './error-exception-filter/error-exception.filter'
import { HttpExceptionFilter } from './error-exception-filter/http-exception-filter.'
import { AuditLogModule } from './features/audit-log/audit-log.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AppConfigModule,
    UsersModule,
    PrismaModule,
    AuditLogModule,
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
    // {
    //   provide: AuditLogServiceAbstract,
    //   useClass: AuditLogService,
    // },
  ],
})
export class MainModule {}
