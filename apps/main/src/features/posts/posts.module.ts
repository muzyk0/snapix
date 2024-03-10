import { Module, type Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { NotificationModule } from '../notification/notification.module'
import { AppConfigModule } from '@app/config'
import { PostsController } from './controllers/posts.controller'
import { postHandlers } from './application/use-cases/handler'
import { IPostRepository } from './application/interface'
import { PostsRepository } from './infrastructure/posts.repository'

const Services: Array<Provider<unknown>> = []

const Repositories = [
  {
    provide: IPostRepository,
    useClass: PostsRepository,
  },
]

@Module({
  imports: [CqrsModule, NotificationModule, AppConfigModule],
  controllers: [PostsController],
  providers: [...Services, ...postHandlers, ...Repositories],
  exports: [],
})
export class PostsModule {}
