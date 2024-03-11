import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiTags } from '@nestjs/swagger'

import { AuthGuard } from '../../auth'
import { GetUserContextDecorator } from '../../auth/decorators/get-user-context.decorator'
import { JwtAtPayload } from '../../auth/types/jwt.type'
import { CreatePostCommand } from '../application/use-cases/create-post.handler'
import { ApiCreatePost } from './open-api/create-post.swagger'
import { CreatePostDto } from './dto/create-post.dto'
import { GetPostCommand } from '../application/use-cases/get-post.handler'
import { ApiGetPost } from './open-api/get-post.swagger'
import { UpdatePostDto } from './dto/update-post.dto'
import { ApiUpdatePost } from './open-api/update-post.swagger'
import { UpdatePostCommand } from '../application/use-cases/update-post.handler'

@ApiTags('Posts')
@Controller('/posts')
export class PostsController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiCreatePost()
  @AuthGuard()
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() body: CreatePostDto, @GetUserContextDecorator() ctx: JwtAtPayload) {
    return this.commandBus.execute(new CreatePostCommand(ctx.user.id, body.content, body.photoId))
  }

  @ApiGetPost()
  @AuthGuard()
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getPost(@Param('id') postId: string) {
    return this.commandBus.execute(new GetPostCommand(+postId))
  }

  @ApiUpdatePost()
  @AuthGuard()
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updatePost(@Param('id') postId: string, @Body() body: UpdatePostDto) {
    await this.commandBus.execute(new UpdatePostCommand(+postId, body.content))
  }
}
