import { Module } from '@nestjs/common'
import { PostsApiController } from './posts-api.controller'
import { PostsApiService } from './posts-api.service'

@Module({
  imports: [],
  controllers: [PostsApiController],
  providers: [PostsApiService],
})
export class PostsApiModule {}
