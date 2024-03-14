import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IUserFilesFacade } from '../../services/user-files.facede'
import { type UploadFilesViewDto } from '@app/core/types/dto'
import { type UploadAvatarDto } from '../upload-avatar.dto'
import { PrismaService } from '@app/prisma'
import { BadRequestException } from '@nestjs/common'
import { isNil } from 'lodash'
import { randomUUID } from 'crypto'

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

    const newReferenceId = randomUUID()

    const imageFiles = await this.storage.uploadAvatar({
      referenceId: newReferenceId,
      buffer: payload.buffer,
      mimetype: payload.mimetype,
      originalname: payload.originalname,
    })

    if (user.profile.avatarId) {
      await this.storage.deleteAvatar(user.profile.avatarId)
    }

    user.profile.avatarId = newReferenceId

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profile: {
          update: {
            avatarId: newReferenceId,
          },
        },
      },
      include: {
        profile: true,
      },
    })

    return {
      files: imageFiles.files,
    }
  }
}
