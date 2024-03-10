import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiTags } from '@nestjs/swagger'

import { AuthGuard } from '../../auth'
import { GetUserContextDecorator } from '../../auth/decorators/get-user-context.decorator'
import { JwtAtPayload } from '../../auth/types/jwt.type'
import { CreatePostCommand } from '../application/use-cases/create-post.handler'
import { ApiCreatePost } from './open-api/create-post.swagger'
import { ContentPostDto } from './dto/content-post.dto'

@ApiTags('Posts')
@Controller('/posts')
export class PostsController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiCreatePost()
  @AuthGuard()
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() body: ContentPostDto, @GetUserContextDecorator() ctx: JwtAtPayload) {
    await this.commandBus.execute(new CreatePostCommand(ctx.user.id, body.content, body.photoId))
  }
}
