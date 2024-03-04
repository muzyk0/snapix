import { Injectable, Logger } from '@nestjs/common'
import {
  DeleteObjectCommand,
  type DeleteObjectCommandOutput,
  PutObjectCommand,
  type PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3'
import { AppConfigService } from '@app/config'
import { type User } from '@prisma/client'

export abstract class IStorageAdapter {
  abstract uploadAvatar(userId: User['id'], file: Express.Multer.File): Promise<{ path: string }>

  abstract deleteAvatar(userId: User['id']): Promise<PutObjectCommandOutput>
}

@Injectable()
export class LocalStorageAdapter implements IStorageAdapter {
  private readonly client: S3Client
  private readonly logger = new Logger(LocalStorageAdapter.name)

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

  public async uploadAvatar(
    userId: User['id'],
    file: Express.Multer.File
  ): Promise<{ path: string }> {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: 'snapix',
        Key: `content/users/${userId}/avatars/${userId}_avatar.png`,
      })

      const result = await this.client.send(deleteCommand)

      console.log(result)

      const command = new PutObjectCommand({
        Bucket: 'snapix',
        Key: `content/users/${userId}/avatars/${userId}_avatar.png`,
        Body: file.buffer,
        ContentType: 'image/png',
      })
      await this.client.send(command)
      return {
        path: `https://${command.input.Bucket}.storage.yandexcloud.net/${command.input.Key}`,
      }
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }

  public async deleteAvatar(userId: User['id']): Promise<DeleteObjectCommandOutput> {
    try {
      const getObjectCommand = new DeleteObjectCommand({
        Bucket: 'snapix',
        Key: `content/users/${userId}/avatars/${userId}_avatar.png`,
      })

      const result = await this.client.send(getObjectCommand)

      return result
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }
}
