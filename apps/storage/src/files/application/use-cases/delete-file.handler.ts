import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IStorageAdapter, type StorageCommandEnum } from '../../adapters/storage-adapter.abstract'
import { File } from '../../domain/entity/files.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { isNil } from 'lodash'
import { BadRequestException } from '@nestjs/common'

export class DeleteAvatarFileCommand {
  constructor(
    readonly type: StorageCommandEnum.AVATAR,
    readonly referenceId: string
  ) {}
}

@CommandHandler(DeleteAvatarFileCommand)
export class DeleteFileHandler implements ICommandHandler<DeleteAvatarFileCommand> {
  constructor(
    private readonly storage: IStorageAdapter,
    @InjectModel(File.name) private readonly fileModel: Model<File>
  ) {}

  async execute(payload: DeleteAvatarFileCommand): Promise<void> {
    const file = await this.fileModel.findOne({
      type: payload.type,
      referenceId: payload.referenceId,
    })

    if (isNil(file)) {
      throw new BadRequestException()
    }

    await this.storage.delete(file.key)

    await this.fileModel.deleteOne({ _id: file._id })
  }
}
