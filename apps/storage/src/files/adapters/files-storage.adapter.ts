import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { AppConfigService } from '@app/config'
import {
  type GetFileOutput,
  type IStorageAdapter,
  type UploadFileOutput,
  type UploadFileParams,
} from './storage-adapter.abstract'
import * as mime from 'mime-types'
import * as crypto from 'crypto'
import { isNil } from 'lodash'

@Injectable()
export class FilesStorageAdapter implements IStorageAdapter {
  private readonly client: S3Client
  private readonly logger = new Logger(FilesStorageAdapter.name)
  private readonly bucket = 'snapix-prod'

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

  /** @deprecated use getFullPath(key: string) instead if key exist */
  public async get(key: string): Promise<GetFileOutput | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })

      await this.client.send(command)

      return {
        path: `https://${this.bucket}.storage.yandexcloud.net/${command.input.Key}`,
      }
    } catch (e) {
      return null
    }
  }

  public async upload({ dirKey, buffer, mimetype }: UploadFileParams): Promise<UploadFileOutput> {
    const hash = crypto.createHash('sha256').update(buffer).digest('hex')

    try {
      const fileName = `${hash}.${mime.extension(mimetype)}`
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      const contentType = mime.contentType(mimetype) || 'application/octet-stream'

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: `${dirKey}/${fileName}`,
        Body: buffer,
        ContentType: contentType,
      })

      const response = await this.client.send(command)

      if (isNil(command.input.Key) || isNil(response.ETag)) {
        throw new InternalServerErrorException()
      }

      return {
        key: command.input.Key,
        ETag: response.ETag,
        path: this.getFullPath(command.input.Key),
      }
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }

  public async delete(key: string): Promise<void> {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })

      await this.client.send(deleteCommand)
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }

  public async deleteMany(keys: string[]): Promise<void> {
    try {
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: this.bucket,
        Delete: { Objects: keys.map(key => ({ Key: key })) },
      })

      await this.client.send(deleteCommand)
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }

  /**
   +   * Constructs the full URL path for a given file key in the storage bucket.
   +   * @param {string} key - The key of the file in the storage bucket.
   +   * @returns {string} The full URL path to the file.
   +   */
  public getFullPath(key: string): string {
    return `https://${this.bucket}.storage.yandexcloud.net/${key}`
  }
}
