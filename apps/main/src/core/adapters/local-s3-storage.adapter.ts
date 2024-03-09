import { Injectable, Logger } from '@nestjs/common'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { AppConfigService } from '@app/config'
import {
  type IStorageAdapter,
  type StorageCommandEnum,
  type UploadAvatarParams,
} from './storage-adapter.abstract'
import { type ImageFileInfo } from '@app/core/types/dto'

@Injectable()
export class LocalS3StorageAdapter implements IStorageAdapter {
  private readonly client: S3Client
  private readonly logger = new Logger(LocalS3StorageAdapter.name)

  constructor(config: AppConfigService) {
    this.client = new S3Client({
      region: 'us-east-1',
      endpoint: 'https://storage.yandexcloud.net',
      credentials: {
        accessKeyId: config.s3Config.accessKeyId,
        secretAccessKey: config.s3Config.secretAccessKey,
      },
    })
  }

  public async get(_type: StorageCommandEnum, _ownerId: string): Promise<ImageFileInfo[]> {
    return []
  }

  public async upload(
    type: StorageCommandEnum,
    payload: UploadAvatarParams
  ): Promise<ImageFileInfo[]> {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: 'snapix',
        Key: `content/users/${payload.ownerId}/${type}/${payload.ownerId}_avatar.png`,
      })

      await this.client.send(deleteCommand)

      const command = new PutObjectCommand({
        Bucket: 'snapix',
        Key: `content/users/${payload.ownerId}/${type}/${payload.ownerId}_avatar.png`,
        Body: payload.buffer,
        ContentType: 'image/png',
      })
      await this.client.send(command)

      return [
        {
          url: `https://${command.input.Bucket}.storage.yandexcloud.net/${command.input.Key}`,
          width: 300,
          height: 300,
          size: 300,
        },
      ]
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }

  public async delete(type: StorageCommandEnum, ownerId: string): Promise<void> {
    try {
      const getObjectCommand = new DeleteObjectCommand({
        Bucket: 'snapix',
        Key: `content/users/${ownerId}/${type}/${ownerId}_avatar.png`,
      })

      await this.client.send(getObjectCommand)
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }
}
