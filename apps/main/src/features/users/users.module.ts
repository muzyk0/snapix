import { Module } from '@nestjs/common'
import { UsersController } from './controllers/users.controller'
import { UsersQueryRepository } from './infrastructure/users.query.repository'
import { IUserService, UserService } from './services/user.service'
import { NotificationModule } from '../notification/notification.module'
import { usersHandlers } from './application/use-cases/handlers'
import { CqrsModule } from '@nestjs/cqrs'
import { IStorageAdapter, LocalStorageAdapter } from './services/storage.adapter'

@Module({
  imports: [CqrsModule, NotificationModule],
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
      useClass: LocalStorageAdapter,
    },
    ...usersHandlers,
  ],
  exports: [IUserService],
})
export class UsersModule {}
