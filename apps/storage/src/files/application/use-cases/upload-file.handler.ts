import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IStorageAdapter, type StorageCommandEnum } from '../../adapters/storage-adapter.abstract'
import { type UploadFilesOutputDto } from '@app/core/types/dto/upload-files.dto'
import { type UploadFileDto } from '@app/core/types/dto/upload-file.dto'
import { File } from '../../domain/entity/files.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { isNil } from 'lodash'

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
    const fileForRemove = await this.fileModel.findOneAndDelete({
      type,
      referenceId: payload.referenceId,
    })

    if (!isNil(fileForRemove)) {
      await this.storage.delete(fileForRemove.key)
    }

    const result = await this.storage.upload({
      dirKey: `content/users/${payload.referenceId}/${type}`,
      buffer: payload.buffer,
      mimetype: payload.mimetype,
    })

    const file = await this.fileModel.create({
      type,
      referenceId: payload.referenceId,
      ETag: result.ETag,
      key: result.key,
    })

    console.log(file)

    await file.save()

    return {
      id: file.id,
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
