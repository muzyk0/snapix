import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IStorageAdapter, StorageCommandEnum } from '../../adapters/storage-adapter.abstract'
import { type ImageFileInfo } from '@app/core/types/dto/upload-avatar-view.dto'
import { type UploadAvatarDto } from '../../controllers/upload-avatar.dto'

export class UploadAvatarFileCommand {
  constructor(readonly payload: UploadAvatarDto) {}
}

@CommandHandler(UploadAvatarFileCommand)
export class UploadFileHandler implements ICommandHandler<UploadAvatarFileCommand> {
  constructor(private readonly storage: IStorageAdapter) {}

  async execute({ payload }: UploadAvatarFileCommand): Promise<ImageFileInfo[]> {
    const result = await this.storage.upload({
      dirKey: `content/users/${payload.ownerId}/${StorageCommandEnum.AVATAR}`,
      buffer: payload.buffer,
      mimetype: payload.mimetype,
    })

    return [
      {
        url: result.path,
        width: 0,
        height: 0,
        size: 0,
      },
    ]
  }
}
