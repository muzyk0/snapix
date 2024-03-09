import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IStorageAdapter, type StorageCommandEnum } from '../../adapters/storage-adapter.abstract'
import { type ImageFileInfo } from '@app/core/types/dto/upload-avatar-view.dto'
import { type UploadAvatarDto } from '../../controllers/dto/upload-avatar.dto'
import { File } from '../../domain/entity/files.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

export class UploadAvatarFileCommand {
  constructor(
    readonly type: StorageCommandEnum.AVATAR,
    readonly payload: UploadAvatarDto
  ) {}
}

@CommandHandler(UploadAvatarFileCommand)
export class UploadFileHandler implements ICommandHandler<UploadAvatarFileCommand> {
  constructor(
    private readonly storage: IStorageAdapter,
    @InjectModel(File.name) private readonly fileModel: Model<File>
  ) {}

  async execute({ type, payload }: UploadAvatarFileCommand): Promise<ImageFileInfo[]> {
    const result = await this.storage.upload({
      dirKey: `content/users/${payload.ownerId}/${type}`,
      buffer: payload.buffer,
      mimetype: payload.mimetype,
    })

    await this.fileModel.deleteOne({
      type,
      ownerId: payload.ownerId,
    })

    const file = await this.fileModel.create({
      type,
      ownerId: payload.ownerId,
      ETag: result.ETag,
      key: result.key,
    })

    await file.save()

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
