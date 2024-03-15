import { Global, Module } from '@nestjs/common'
import { AppConfigModule, AppConfigService } from '@app/config'
import { ClientsModule, type TcpClientOptions, Transport } from '@nestjs/microservices'
import { ServicesEnum } from '@app/core/constants'
import { IStorageAdapter } from './storage-adapter.abstract'
import { StorageServiceAdapter } from './storage-service.adapter'
import { StorageService } from './storage.service'
import { StorageRepository } from './storage.repository'

const providers = [
  {
    provide: IStorageAdapter,
    useClass: StorageServiceAdapter,
  },
  StorageService,
  StorageRepository,
]

@Global()
@Module({
  imports: [
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
  providers,
  exports: providers,
})
export class StorageModule {}
