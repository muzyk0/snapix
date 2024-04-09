import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ApiTags } from '@nestjs/swagger'
import { type UploadFilesViewDto } from '@app/core/types/dto'
import { GetAvatarQuery, GetPublicProfileQuery } from '../application'
import { ApiGetPublicUserProfile, ApiGetUserAvatar } from './open-api'
import { UserIdParamDto } from './dto'

@ApiTags('Users Public')
@Controller('public-users')
export class UsersPublicController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiGetUserAvatar()
  @Get('/:userId/profile/avatar')
  async getAvatar(@Param() params: UserIdParamDto) {
    return this.queryBus.execute<GetAvatarQuery, UploadFilesViewDto>(
      new GetAvatarQuery(params.userId)
    )
  }

  @ApiGetPublicUserProfile()
  @Get('/:userId/profile')
  async getProfileByUserId(@Param() params: UserIdParamDto) {
    return this.queryBus.execute<GetPublicProfileQuery, GetPublicProfileQuery>(
      new GetPublicProfileQuery(params.userId)
    )
  }
}
