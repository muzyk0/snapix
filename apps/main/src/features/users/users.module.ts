import { Module } from '@nestjs/common'
import { UsersController } from './controllers/users.controller'
import { UsersQueryRepository } from './infrastructure/users.query.repository'
import { IUserService, UserService } from './services/user.service'
import { NotificationModule } from '../notification/notification.module'
import { usersHandlers } from './application/use-cases/handlers'
import { CqrsModule } from '@nestjs/cqrs'
import { IUserFilesFacade, UserFilesFacade } from './services/user-files.facede'
import { StorageModule } from '../../core/adapters/storage/storage.module'

@Module({
  imports: [CqrsModule, NotificationModule, StorageModule],
  controllers: [UsersController],
  providers: [
    UsersQueryRepository,
    // UserService,
    {
      provide: IUserService,
      useClass: UserService,
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
