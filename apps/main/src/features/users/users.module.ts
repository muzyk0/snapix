import { Module } from '@nestjs/common'
import { UsersController } from './controllers/users.controller'
import { UsersQueryRepository } from './infrastructure/users.query.repository'
import { IUserService, UserService } from './services/user.service'
import { NotificationModule } from '../notification/notification.module'
import { usersHandlers } from './application/use-cases/handlers'
import { CqrsModule } from '@nestjs/cqrs'
import { IImageFilesFacade, ImageFilesFacade } from '../../core/adapters/storage/user-files.facade'
import { StorageModule } from '../../core/adapters/storage/storage.module'
import { UsersPublicController } from './controllers/public-users.controller'

@Module({
  imports: [CqrsModule, NotificationModule, StorageModule],
  controllers: [UsersController, UsersPublicController],
  providers: [
    UsersQueryRepository,
    // UserService,
    {
      provide: IUserService,
      useClass: UserService,
    },
    {
      provide: IImageFilesFacade,
      useClass: ImageFilesFacade,
    },
    ...usersHandlers,
  ],
  exports: [IUserService],
})
export class UsersModule {}
