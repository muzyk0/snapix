import { Module } from '@nestjs/common'
import { UsersController } from './controllers/users.controller'
import { UsersQueryRepository } from './infrastructure/users.query.repository'
import { UserService } from './services/user.service'
import { NotificationModule } from '../notification/notification.module'

@Module({
  imports: [NotificationModule],
  controllers: [UsersController],
  providers: [UsersQueryRepository, UserService],
  exports: [UserService],
})
export class UsersModule {}
