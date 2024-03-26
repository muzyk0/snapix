import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IUserFilesFacade } from '../../services/user-files.facede'
import { type UploadFilesViewDto } from '@app/core/types/dto'
import { type UploadAvatarDto } from '../upload-avatar.dto'
import { PrismaService } from '@app/prisma'
import { BadRequestException } from '@nestjs/common'
import { isNil } from 'lodash'

export class UploadAvatarCommand {
  constructor(
    readonly userId: number,
    readonly payload: UploadAvatarDto
  ) {}
}

@CommandHandler(UploadAvatarCommand)
export class UploadAvatarHandler implements ICommandHandler<UploadAvatarCommand> {
  constructor(
    private readonly storage: IUserFilesFacade,
    private readonly prisma: PrismaService
  ) {}

  async execute({ userId, payload }: UploadAvatarCommand): Promise<UploadFilesViewDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
      },
    })

    if (isNil(user)) {
      throw new BadRequestException('User does not exists')
    }

    const response = await this.storage.uploadAvatar({
      ownerId: String(userId),
      buffer: payload.buffer,
      mimetype: payload.mimetype,
      originalname: payload.originalname,
    })

    if (user.profile.avatarId) {
      await this.storage.deleteAvatar(user.profile.avatarId)
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profile: {
          update: {
            avatarId: response.referenceId,
          },
        },
      },
      include: {
        profile: true,
      },
    })

    return {
      files: response.files,
    }
  }
}
