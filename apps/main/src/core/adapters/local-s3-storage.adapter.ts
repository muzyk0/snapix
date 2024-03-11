import { Injectable, Logger } from '@nestjs/common'
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { AppConfigService } from '@app/config'
import {
  type IStorageAdapter,
  type StorageCommandEnum,
  type UploadAvatarParams,
  type UploadPhotoToPostParams,
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

  public async uploadPhotoToPost(
    type: StorageCommandEnum,
    payload: UploadPhotoToPostParams
  ): Promise<ImageFileInfo[]> {
    try {
      const command = new PutObjectCommand({
        Bucket: 'snapix',
        Key: `content/posts/${payload.photoId}/${type}/${payload.photoId}_posts_photo.png`,
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

  public async deletePhotoToPost(type: StorageCommandEnum, photoId: string): Promise<void> {
    try {
      const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: 'snapix',
        Key: `content/users/${photoId}/${type}/${photoId}_posts_photo.png`,
      })

      await this.client.send(deleteObjectCommand)
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }

  public async getPhotoToPost(type: StorageCommandEnum, photoId: string): Promise<ImageFileInfo[]> {
    try {
      const getObjectCommand = new GetObjectCommand({
        Bucket: 'snapix',
        Key: `content/users/${photoId}/${type}/${photoId}_posts_photo.png`,
      })
      await this.client.send(getObjectCommand)
      return [
        {
          url: `https://${getObjectCommand.input.Bucket}.storage.yandexcloud.net/${getObjectCommand.input.Key}`,
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
}
