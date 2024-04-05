import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../../auth'
import {
  type MyProfileViewDto,
  UploadAvatarCommand,
  DeleteAvatarCommand,
  UpdateProfileCommand,
  GetMyProfileQuery,
  GetAvatarQuery,
} from '../application'
import { GetUserContextDecorator } from '../../auth/decorators/get-user-context.decorator'
import { JwtAtPayload } from '../../auth/types/jwt.type'

import {
  ApiUploadUserAvatar,
  ApiDeleteUserAvatar,
  ApiUpdateUserProfile,
  ApiGetUserProfile,
  ApiGetUserAvatar,
} from './open-api'

import { type UploadFilesOutputDto, type UploadFilesViewDto } from '@app/core/types/dto'
import { UpdateProfileDto } from './dto'

import { ImagesValidationPipe } from '../../../core/adapters/storage/pipes/imagesValidationPipe'
import { UsersQueryRepository } from '../infrastructure/users.query.repository'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly usersQueryRepository: UsersQueryRepository
  ) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the count of registered users.',
    schema: {
      type: 'object',
      properties: {
        totalCount: {
          type: 'number',
        },
      },
    },
  })
  @Get('/total')
  async countRegisteredUsers(): Promise<{ totalCount: number }> {
    return await this.usersQueryRepository.countRegisteredUsers()
  }

  // todo: Write tests
  @ApiUploadUserAvatar()
  @AuthGuard()
  @Post('/profile/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile(ImagesValidationPipe())
    file: Express.Multer.File,
    @GetUserContextDecorator() ctx: JwtAtPayload
  ) {
    return this.commandBus.execute<UploadAvatarCommand, UploadFilesOutputDto>(
      new UploadAvatarCommand(ctx.user.id, {
        buffer: file.buffer,
        mimetype: file.mimetype,
        originalname: file.originalname,
      })
    )
  }

  @ApiDeleteUserAvatar()
  @AuthGuard()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/profile/avatar')
  async deleteAvatar(@GetUserContextDecorator() ctx: JwtAtPayload): Promise<void> {
    return this.commandBus.execute<DeleteAvatarCommand>(new DeleteAvatarCommand(ctx.user.id))
  }

  @ApiUpdateUserProfile()
  @AuthGuard()
  @Put('/profile')
  @HttpCode(HttpStatus.OK)
  async fillOutProfile(
    @Body() body: UpdateProfileDto,
    @GetUserContextDecorator() ctx: JwtAtPayload
  ) {
    return this.commandBus.execute<UpdateProfileCommand>(
      new UpdateProfileCommand(ctx.user.id, body)
    )
  }

  @ApiGetUserProfile()
  @AuthGuard()
  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  async getProfileInfo(@GetUserContextDecorator() ctx: JwtAtPayload) {
    return this.queryBus.execute<GetMyProfileQuery, MyProfileViewDto>(
      new GetMyProfileQuery(ctx.user.id)
    )
  }

  @ApiGetUserAvatar()
  @AuthGuard()
  @Get('/profile/avatar')
  async getAvatar(@GetUserContextDecorator() ctx: JwtAtPayload) {
    return this.queryBus.execute<GetAvatarQuery, UploadFilesViewDto>(
      new GetAvatarQuery(ctx.user.id)
    )
  }
}
