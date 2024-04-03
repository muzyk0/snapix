import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { IImageFilesFacade } from '../../../../core/adapters/storage/user-files.facade'
import { type UploadFilesViewDto } from '@app/core/types/dto'
import { isNil } from 'lodash'
import { PrismaService } from '@app/prisma'
import { type User } from '@prisma/client'
import { NotFoundException } from '@nestjs/common'

export class GetAvatarQuery {
  constructor(readonly userId: User['id']) {}
}

@QueryHandler(GetAvatarQuery)
export class GetAvatarQueryHandler implements IQueryHandler<GetAvatarQuery> {
  constructor(
    private readonly storage: IImageFilesFacade,
    private readonly prisma: PrismaService
  ) {}

  async execute({ userId }: GetAvatarQuery): Promise<UploadFilesViewDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
      },
    })

    if (isNil(user)) {
      throw new NotFoundException('User not found')
    }

    if (isNil(user.profile.avatarId)) {
      return { files: [] }
    }

    const imageFiles = await this.storage.getImages(user.profile.avatarId)

    return {
      files: imageFiles.files,
    }
  }
}
