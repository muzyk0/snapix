import { Module, type Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { NotificationModule } from '../notification/notification.module'
import { AppConfigModule } from '@app/config'
import { PostsController } from './controllers/posts.controller'
import { postHandlers } from './application/use-cases/handler'

const Services: Array<Provider<unknown>> = []

// const Repositories = []

@Module({
  imports: [CqrsModule, NotificationModule, AppConfigModule],
  controllers: [PostsController],
  providers: [...Services, ...postHandlers],
  exports: [],
})
export class PostsModule {}
