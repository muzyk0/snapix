import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { IStorageAdapter } from '../../adapters/storage-adapter.abstract'
import { File } from '../../domain/entity/files.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { isNil } from 'lodash'
import { type UploadFilesOutputDto } from '@app/core/types/dto'

export class GetFileQuery {
  constructor(readonly referenceId: string) {}
}

@QueryHandler(GetFileQuery)
export class GetFileHandler implements IQueryHandler<GetFileQuery> {
  constructor(
    private readonly storage: IStorageAdapter,
    @InjectModel(File.name) private readonly fileModel: Model<File>
  ) {}

  async execute({ referenceId }: GetFileQuery): Promise<UploadFilesOutputDto> {
    const file = await this.fileModel.findOne({
      referenceId,
    })

    if (isNil(file)) {
      return {
        referenceId,
        files: [],
      }
    }

    return {
      referenceId,
      files: [
        {
          url: this.storage.getFullPath(file.original.key),
          width: file.original.width,
          height: file.original.height,
          size: file.original.size,
        },
        ...file.resolutions.map(resolution => ({
          url: this.storage.getFullPath(resolution.key),
          width: resolution.width,
          height: resolution.height,
          size: resolution.size,
        })),
      ],
    }
  }
}
