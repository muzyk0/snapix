import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { IUserFilesFacade } from '../../services/user-files.facede'
import { type UploadFilesViewDto } from '@app/core/types/dto'
import { isNil } from 'lodash'
import { PrismaService } from '@app/prisma'
import { type User } from '@prisma/client'

export class GetAvatarQuery {
  constructor(readonly userId: User['id']) {}
}

@QueryHandler(GetAvatarQuery)
export class GetAvatarQueryHandler implements IQueryHandler<GetAvatarQuery> {
  constructor(
    private readonly storage: IUserFilesFacade,
    private readonly prisma: PrismaService
  ) {}

  async execute({ userId }: GetAvatarQuery): Promise<UploadFilesViewDto> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        profile: true,
      },
    })

    if (isNil(user.profile.avatarId)) {
      return { files: [] }
    }

    const imageFiles = await this.storage.getAvatar(user.profile.avatarId)

    return {
      files: imageFiles.files,
    }
  }
}
