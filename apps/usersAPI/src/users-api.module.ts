import { Module } from '@nestjs/common'
import { UsersApiController } from './users-api.controller'
import { UsersApiService } from './users-api.service'

@Module({
  imports: [],
  controllers: [UsersApiController],
  providers: [UsersApiService],
})
export class UsersApiModule {}
