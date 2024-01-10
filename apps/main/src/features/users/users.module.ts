import { Module } from '@nestjs/common'
import { UsersController } from './controllers/users.controller'
import { UsersQueryRepository } from './infrastructure/users.query.repository'

@Module({
  controllers: [UsersController],
  providers: [UsersQueryRepository],
})
export class UsersModule {}
