import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { IStorageAdapter, type StorageCommandEnum } from '../../adapters/storage-adapter.abstract'
import { File } from '../../domain/entity/files.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { isNil } from 'lodash'
import type { UploadFilesOutputDto } from '@app/core/types/dto'

export class GetFileQuery {
  constructor(
    readonly type: StorageCommandEnum.AVATAR,
    readonly referenceId: string
  ) {}
}

@QueryHandler(GetFileQuery)
export class GetFileHandler implements IQueryHandler<GetFileQuery> {
  constructor(
    private readonly storage: IStorageAdapter,
    @InjectModel(File.name) private readonly fileModel: Model<File>
  ) {}

  async execute(payload: GetFileQuery): Promise<UploadFilesOutputDto> {
    const file = await this.fileModel.findOne(payload)

    if (isNil(file)) {
      return {
        files: [],
        id: null,
      }
    }

    const result = await this.storage.get(file.key)

    if (isNil(result)) {
      return {
        files: [],
        id: null,
      }
    }

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
