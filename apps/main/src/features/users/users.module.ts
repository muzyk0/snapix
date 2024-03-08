import { Module } from '@nestjs/common'
import { UsersController } from './controllers/users.controller'
import { UsersQueryRepository } from './infrastructure/users.query.repository'
import { IUserService, UserService } from './services/user.service'
import { NotificationModule } from '../notification/notification.module'
import { usersHandlers } from './application/use-cases/handlers'
import { CqrsModule } from '@nestjs/cqrs'
import { IUserFilesFacade, UserFilesFacade } from './services/user-files.facede'
import { IStorageAdapter } from '../../core/adapters/storage-adapter.abstract'
import { StorageServiceAdapter } from '../../core/adapters/storage-service.adapter'
import { ClientsModule, type TcpClientOptions, Transport } from '@nestjs/microservices'
import { ServicesEnum } from '@app/core/constants'
import { AppConfigModule, AppConfigService } from '@app/config'

@Module({
  imports: [
    CqrsModule,
    NotificationModule,
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
  ],
  controllers: [UsersController],
  providers: [
    UsersQueryRepository,
    // UserService,
    {
      provide: IUserService,
      useClass: UserService,
    },
    {
      provide: IStorageAdapter,
      useClass: StorageServiceAdapter,
    },
    {
      provide: IUserFilesFacade,
      useClass: UserFilesFacade,
    },
    ...usersHandlers,
  ],
  exports: [IUserService],
})
export class UsersModule {}
