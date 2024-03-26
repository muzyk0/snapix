import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { NotificationModule } from '../notification/notification.module'
import { AppConfigModule } from '@app/config'
import { PostsController } from './controllers/posts.controller'
import { postHandlers } from './application/use-cases/handler'
import { IPostRepository } from './application/interface'
import { PostsRepository } from './infrastructure/posts.repository'
import { StorageModule } from '../../core/adapters/storage/storage.module'
import { IImageFilesFacade, ImageFilesFacade } from '../../core/adapters/storage/user-files.facede'

const Repositories = [
  {
    provide: IPostRepository,
    useClass: PostsRepository,
  },
]

@Module({
  imports: [CqrsModule, NotificationModule, AppConfigModule, StorageModule],
  controllers: [PostsController],
  providers: [
    {
      provide: IImageFilesFacade,
      useClass: ImageFilesFacade,
    },
    ...postHandlers,
    ...Repositories,
  ],
  exports: [],
})
export class PostsModule {}
