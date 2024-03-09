import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { IUserFilesFacade } from '../../services/user-files.facede'
import { type UploadAvatarViewDto } from '@app/core/types/dto'
import { type User } from '@prisma/client'

export class GetAvatarQuery {
  constructor(readonly userId: User['id']) {}
}

@QueryHandler(GetAvatarQuery)
export class GetAvatarQueryHandler implements IQueryHandler<GetAvatarQuery> {
  constructor(private readonly storage: IUserFilesFacade) {}

  async execute({ userId }: GetAvatarQuery): Promise<UploadAvatarViewDto> {
    const imageFiles = await this.storage.getAvatar(userId)

    return {
      avatars: imageFiles,
    }
  }
}
