import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IStorageAdapter, type StorageCommandEnum } from '../../adapters/storage-adapter.abstract'
import { type UploadFilesOutputDto } from '@app/core/types/dto/upload-files.dto'
import { type UploadFileDto } from '@app/core/types/dto/upload-file.dto'
import { File } from '../../domain/entity/files.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { randomUUID } from 'crypto'

export class UploadFileCommand {
  constructor(
    readonly type: StorageCommandEnum.AVATAR,
    readonly payload: UploadFileDto
  ) {}
}

@CommandHandler(UploadFileCommand)
export class UploadFileHandler implements ICommandHandler<UploadFileCommand> {
  constructor(
    private readonly storage: IStorageAdapter,
    @InjectModel(File.name) private readonly fileModel: Model<File>
  ) {}

  async execute({ type, payload }: UploadFileCommand): Promise<UploadFilesOutputDto> {
    // const fileForRemove = await this.fileModel.findOneAndDelete({
    //   type,
    //   referenceId: payload.ownerId,
    // })
    //
    // if (!isNil(fileForRemove)) {
    //   await this.storage.delete(fileForRemove.key)
    // }

    const referenceId = randomUUID()

    const result = await this.storage.upload({
      dirKey: `content/users/${payload.ownerId}/${type}/${referenceId}`,
      buffer: payload.buffer,
      mimetype: payload.mimetype,
    })

    const file = await this.fileModel.create({
      type,
      referenceId,
      ownerId: payload.ownerId,
      ETag: result.ETag,
      key: result.key,
    })

    await file.save()

    return {
      referenceId: file.referenceId,
      files: [
        {
          url: result.path,
          width: 0,
          height: 0,
          size: 0,
        },
      ],
    }
  }
}
