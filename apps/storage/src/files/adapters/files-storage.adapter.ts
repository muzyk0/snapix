import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { AppConfigService } from '@app/config'
import {
  type UploadFileOutput,
  type IStorageAdapter,
  type UploadFileParams,
  type GetFileOutput,
} from './storage-adapter.abstract'
import * as mime from 'mime-types'
import * as crypto from 'crypto'
import { isNil } from 'lodash'

@Injectable()
export class FilesStorageAdapter implements IStorageAdapter {
  private readonly client: S3Client
  private readonly logger = new Logger(FilesStorageAdapter.name)
  private readonly bucket = 'snapix'

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

  public async get(key: string): Promise<GetFileOutput> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })

      const response = await this.client.send(command)

      console.log('response GetObjectCommand', response)

      return {
        path: `https://${this.bucket}.storage.yandexcloud.net/${command.input.Key}`,
      }
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }

  public async upload({ dirKey, buffer, mimetype }: UploadFileParams): Promise<UploadFileOutput> {
    // fixme: This this object {type: 'Buffer', data: number[]}
    const fileBuffer = Buffer.from(buffer)

    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex')

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: `${dirKey}/${hash}.${mime.extension(mimetype)}`,
        Body: fileBuffer,
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        ContentType: mime.contentType(mimetype) || 'application/octet-stream',
      })

      console.log('putObjectCommand', command)
      const response = await this.client.send(command)
      console.log('upload response', response)
      if (isNil(command.input.Key) || isNil(response.ETag)) {
        throw new InternalServerErrorException()
      }
      return {
        key: command.input.Key,
        ETag: response.ETag,
        path: `https://${this.bucket}.storage.yandexcloud.net/${command.input.Key}`,
      }
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }

  public async delete(key: string): Promise<void> {
    try {
      const getObjectCommand = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })

      await this.client.send(getObjectCommand)
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }
}
