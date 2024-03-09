import { Inject, Injectable, Logger } from '@nestjs/common'
import {
  type IStorageAdapter,
  type StorageCommandEnum,
  type UploadAvatarParams,
} from './storage-adapter.abstract'
import { ClientProxy } from '@nestjs/microservices'
import { defaultTimeoutTcpRequest, ServicesEnum } from '@app/core/constants'
import { firstValueFrom, timeout } from 'rxjs'
import { type ImageFileInfo } from '@app/core/types/dto'

@Injectable()
export class StorageServiceAdapter implements IStorageAdapter {
  private readonly logger = new Logger(StorageServiceAdapter.name)

  constructor(@Inject(ServicesEnum.STORAGE_SERVICE) private readonly client: ClientProxy) {}

  public async get(type: StorageCommandEnum, ownerId: string): Promise<ImageFileInfo[]> {
    try {
      const response = this.client
        .send<ImageFileInfo[]>({ cmd: 'get-file', type }, ownerId)
        .pipe(timeout(defaultTimeoutTcpRequest))

      const images = await firstValueFrom(response)

      return images
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }

  public async upload(
    type: StorageCommandEnum,
    payload: UploadAvatarParams
  ): Promise<ImageFileInfo[]> {
    try {
      const response = this.client
        .send<ImageFileInfo[]>({ cmd: 'upload-file', type }, payload)
        .pipe(timeout(defaultTimeoutTcpRequest))

      const images = await firstValueFrom(response)

      return images
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }

  public async delete(type: StorageCommandEnum, ownerId: string): Promise<void> {
    try {
      this.client
        .emit<number>({ cmd: 'delete-file', type }, ownerId)
        .pipe(timeout(defaultTimeoutTcpRequest))
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }
}
