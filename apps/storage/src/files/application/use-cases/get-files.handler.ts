import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { IStorageAdapter } from '../../adapters/storage-adapter.abstract'
import { File } from '../../domain/entity/files.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { isNil } from 'lodash'
import { type UploadManyFilesOutputDto } from '@app/core/types/dto'

export class GetFilesQuery {
  constructor(readonly referenceIds: string[]) {}
}

@QueryHandler(GetFilesQuery)
export class GetFilesHandler implements IQueryHandler<GetFilesQuery> {
  constructor(
    private readonly storage: IStorageAdapter,
    @InjectModel(File.name) private readonly fileModel: Model<File>
  ) {}

  async execute({ referenceIds }: GetFilesQuery): Promise<UploadManyFilesOutputDto | null> {
    const files = await this.fileModel.find({
      referenceId: { $in: referenceIds },
    })

    if (isNil(files)) {
      return null
    }

    const filterFiles = files.map(file => ({
      referenceId: file.referenceId,
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
    }))

    return {
      list: filterFiles,
    }
  }
}
