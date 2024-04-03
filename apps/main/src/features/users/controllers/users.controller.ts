import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { UsersQueryRepository } from '../infrastructure/users.query.repository'
import { AuthGuard } from '../../auth'
import { UploadAvatarCommand } from '../application/use-cases/upload-avatar.handler'
import { GetUserContextDecorator } from '../../auth/decorators/get-user-context.decorator'
import { JwtAtPayload } from '../../auth/types/jwt.type'
import { DeleteAvatarCommand } from '../application/use-cases/delete-avatar.command'
import { UpdateProfileCommand } from '../application/use-cases/update-profile.handler'
import { GetProfileCommand } from '../application/use-cases/get-profile.handler'
import { ApiUploadUserAvatar } from './open-api/upload-user-avatar.swagger'
import { ApiDeleteUserAvatar } from './open-api/delete-user-avatar.swagger'
import { type UploadFilesOutputDto, type UploadFilesViewDto } from '@app/core/types/dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { GetAvatarQuery } from '../application/use-cases/get-avatar.query.handler'
import { ApiGetUserAvatar } from './open-api/get-user-avatar.swagger'
import { ApiUpdateUserProfile } from './open-api/update-profile.swagger'
import { ApiGetUserProfile } from './open-api/get-profile.swagger'
import { GetAvatarDto } from './dto/get-avatar.dto'
import { ImagesValidationPipe } from '../../../core/adapters/storage/pipes/imagesValidationPipe'

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
    type: Number,
  })
  @Get('/count-register-users')
  async countRegisteredUsers() {
    return await this.usersQueryRepository.countRegisteredUsers()
  }

  @ApiGetUserAvatar()
  @AuthGuard()
  @Get('/:userId/profile/avatar')
  async getAvatar(@Param() params: GetAvatarDto) {
    return this.queryBus.execute<GetAvatarQuery, UploadFilesViewDto>(
      new GetAvatarQuery(Number(params.userId))
    )
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
    return this.commandBus.execute(new GetProfileCommand(ctx.user.id))
  }
}
