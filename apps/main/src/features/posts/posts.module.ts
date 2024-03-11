import { Module, type Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { NotificationModule } from '../notification/notification.module'
import { AppConfigModule, AppConfigService } from '@app/config'
import { PostsController } from './controllers/posts.controller'
import { postHandlers } from './application/use-cases/handler'
import { IPostRepository } from './application/interface'
import { PostsRepository } from './infrastructure/posts.repository'
import { ClientsModule, type TcpClientOptions, Transport } from '@nestjs/microservices'
import { ServicesEnum } from '@app/core/constants'

const Services: Array<Provider<unknown>> = []

const Repositories = [
  {
    provide: IPostRepository,
    useClass: PostsRepository,
  },
]

@Module({
  imports: [
    CqrsModule,
    NotificationModule,
    AppConfigModule,
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
  controllers: [PostsController],
  providers: [...Services, ...postHandlers, ...Repositories],
  exports: [],
})
export class PostsModule {}
