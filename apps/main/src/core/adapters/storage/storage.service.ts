import { Injectable, Logger } from '@nestjs/common'
import { StorageRepository } from './storage.repository'
import { IStorageAdapter } from './storage-adapter.abstract'
import { Cron, CronExpression } from '@nestjs/schedule'
import { OnEvent } from '@nestjs/event-emitter'
import { UploadPostImageEvent } from '../../../features/posts/domain/events/upload-post-image.event'
import { addMinutes } from 'date-fns'
import { CreatePostWithImageEvent } from '../../../features/posts/domain/events/create-post-with-image.event'

import { StorageCommandEnum } from '@app/core/enums/storage-command.enum'

@Injectable()
export class StorageService {
  logger = new Logger(StorageService.name)

  constructor(
    private readonly repository: StorageRepository,
    private readonly storage: IStorageAdapter
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async removeExpiredPostImages(): Promise<void> {
    const files = await this.repository.getExpiresAtFiles()

    const filesReferenceIds = files.map(file => file.referenceId)

    this.logger.log('Removing expired files', files)
    await Promise.all(
      filesReferenceIds.map(async referenceId => {
        return this.storage.delete(StorageCommandEnum.IMAGE, referenceId)
      })
    )

    await this.repository.deleteTempFiles(filesReferenceIds)
  }

  @OnEvent('post.photo.uploaded')
  async handleUploadPostImageEvent(payload: UploadPostImageEvent) {
    await this.repository.createTempFile({
      referenceId: payload.referenceId,
      expiresAt: addMinutes(new Date(), 60),
    })
  }

  @OnEvent('post.create')
  async handleCreatePostWithImageEvent(payload: CreatePostWithImageEvent) {
    await this.repository.deleteTempFiles([payload.post.imageId])
  }
}
