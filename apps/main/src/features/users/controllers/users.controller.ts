import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
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
import type { UploadAvatarViewDto } from '../application/dto/upload-avatar-view.dto'
import { ApiUploadUserAvatar } from './open-api/upload-user-avatar.swagger'
import { ApiDeleteUserAvatar } from './open-api/delete-user-avatar.swagger'

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

  @ApiUploadUserAvatar()
  @AuthGuard()
  @Post('/profile/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @GetUserContextDecorator() ctx: JwtAtPayload
  ) {
    return this.commandBus.execute<UploadAvatarCommand, UploadAvatarViewDto>(
      new UploadAvatarCommand(ctx.user.id, file)
    )
  }

  @ApiDeleteUserAvatar()
  @AuthGuard()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/profile/avatar')
  async getAvatar(@GetUserContextDecorator() ctx: JwtAtPayload): Promise<void> {
    return this.queryBus.execute<DeleteAvatarCommand>(new DeleteAvatarCommand(ctx.user.id))
  }
}
