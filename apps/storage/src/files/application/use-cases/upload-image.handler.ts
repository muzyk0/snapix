import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IStorageAdapter } from '../../adapters/storage-adapter.abstract'
import { type UploadFilesOutputDto } from '@app/core/types/dto/upload-files.dto'
import { type UploadImageDto } from '@app/core/types/dto/upload-image.dto'
import { File } from '../../domain/entity/files.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { randomUUID } from 'crypto'
import { SharpService } from '../services/sharp.service'

export class UploadImageCommand {
  constructor(readonly payload: UploadImageDto) {}
}

@CommandHandler(UploadImageCommand)
export class UploadImageHandler implements ICommandHandler<UploadImageCommand> {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<File>,
    private readonly storage: IStorageAdapter,
    private readonly sharpService: SharpService
  ) {}

  async execute({
    payload,
  }: UploadImageCommand): Promise<Pick<UploadFilesOutputDto, 'referenceId'>> {
    const referenceId = randomUUID()

    await this.uploadOriginalImage(referenceId, payload)
    await this.sharpAndUploadImages(referenceId, payload)

    return {
      referenceId,
    }
  }

  async uploadOriginalImage(referenceId: string, payload: UploadImageDto) {
    const uploadOriginalFileResult = await this.storage.upload({
      dirKey: `content/users/${payload.ownerId}/${payload.type}/${referenceId}/original`,
      buffer: payload.file.buffer,
      mimetype: payload.file.mimetype,
    })

    const originalFileMeta = await this.sharpService.getFileMetadata(payload.file.buffer)

    const file = await this.fileModel.create({
      type: payload.type,
      referenceId,
      ownerId: payload.ownerId,
      original: {
        key: uploadOriginalFileResult.key,
        ETag: uploadOriginalFileResult.ETag,
        width: originalFileMeta.width,
        height: originalFileMeta.height,
        size: originalFileMeta.size,
        format: payload.file.originalname,
        mimetype: payload.file.mimetype,
        filename: originalFileMeta.mimetype,
      },
    })

    await file.save()
  }

  async sharpAndUploadImages(referenceId: string, payload: UploadImageDto) {
    const files = await this.sharpService.sharpImage({
      buffer: payload.file.buffer,
      resolutions: payload.resolutions,
    })

    const uploadResolutionsResult = await Promise.all(
      files.map(async ({ file, width, height }, index) => {
        return this.storage.upload({
          dirKey: `content/users/${payload.ownerId}/${payload.type}/${referenceId}/${width}x${height}`,
          buffer: file,
          mimetype: files[index].mimetype,
        })
      })
    )

    await this.fileModel.updateOne(
      {
        referenceId,
      },
      {
        $set: {
          resolutions: uploadResolutionsResult.map(({ key, ETag }, index) => ({
            key,
            ETag,
            width: files[index].width,
            height: files[index].height,
            size: files[index].size,
            format: files[index].format,
            mimetype: files[index].mimetype,
          })),
        },
      }
    )
  }
}
