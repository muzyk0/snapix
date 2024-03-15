import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
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
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiUploadPhotoToPost } from './open-api/upload-photo-to-post.swagger'
import { UploadPhotoToPostCommand } from '../application/use-cases/upload-photo-to-post.handler'
import { type UploadPhotoForPostViewDto } from './dto/upload-photo-to-post.dto'
import { DeletePostCommand } from '../application/use-cases/delete-post.handler'
import { ApiDeletePost } from './open-api/delete-post.swagger'
import { GetAllPostCommand } from '../application/use-cases/get-all-posts.handler'
import { ApiGetAllPost } from './open-api/get-all-posts.swagger'

@ApiTags('Posts')
@Controller('/posts')
export class PostsController {
  constructor(private readonly commandBus: CommandBus) {}

  // todo: Переписать на загрузку нескольких файлов
  @ApiUploadPhotoToPost()
  @AuthGuard()
  @Post('/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhotoToPost(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 + 10,
        })
        .addFileTypeValidator({
          fileType: ['jpeg', 'png'].join('|'),
        })
        .build({
          // todo: Implement exceptionFactory
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.PAYLOAD_TOO_LARGE,
        })
    )
    file: Express.Multer.File,
    @GetUserContextDecorator() ctx: JwtAtPayload
  ) {
    return this.commandBus.execute<UploadPhotoToPostCommand, UploadPhotoForPostViewDto>(
      new UploadPhotoToPostCommand(ctx.user.id, {
        buffer: file.buffer,
        mimetype: file.mimetype,
        originalname: file.originalname,
      })
    )
  }

  // todo: Переписать создание поста с несколькими загруженными картинками
  @ApiCreatePost()
  @AuthGuard()
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() body: CreatePostDto, @GetUserContextDecorator() ctx: JwtAtPayload) {
    return this.commandBus.execute(new CreatePostCommand(ctx.user.id, body.content, body.imageId))
  }

  @ApiGetAllPost()
  @AuthGuard()
  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAllPosts(@GetUserContextDecorator() ctx: JwtAtPayload) {
    return this.commandBus.execute(new GetAllPostCommand(ctx.user.id))
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
  async updatePost(@Param('id') postId: number, @Body() body: UpdatePostDto) {
    await this.commandBus.execute(new UpdatePostCommand(postId, body.content))
  }

  @ApiDeletePost()
  @AuthGuard()
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') postId: string) {
    await this.commandBus.execute(new DeletePostCommand(+postId))
  }
}
