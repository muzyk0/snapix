import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IUserFilesFacade } from '../../services/user-files.facede'
import { type UploadFilesViewDto } from '@app/core/types/dto'
import { type UploadAvatarDto } from '../upload-avatar.dto'

export class UploadAvatarCommand {
  constructor(readonly payload: UploadAvatarDto) {}
}

@CommandHandler(UploadAvatarCommand)
export class UploadAvatarHandler implements ICommandHandler<UploadAvatarCommand> {
  constructor(private readonly storage: IUserFilesFacade) {}

  async execute({ payload }: UploadAvatarCommand): Promise<UploadFilesViewDto> {
    const imageFiles = await this.storage.uploadAvatar({
      referenceId: String(payload.userId),
      buffer: payload.buffer,
      mimetype: payload.mimetype,
      originalname: payload.originalname,
    })

    return {
      files: imageFiles.files,
    }
  }
}
