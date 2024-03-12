import { Inject, Injectable, Logger } from '@nestjs/common'
import { type IStorageAdapter, type StorageCommandEnum } from './storage-adapter.abstract'
import { ClientProxy } from '@nestjs/microservices'
import { defaultTimeoutTcpRequest, ServicesEnum } from '@app/core/constants'
import { firstValueFrom, timeout } from 'rxjs'
import { type UploadFilesOutputDto } from '@app/core/types/dto'
import { type UploadFileDto } from '@app/core/types/dto/upload-file.dto'

@Injectable()
export class StorageServiceAdapter implements IStorageAdapter {
  private readonly logger = new Logger(StorageServiceAdapter.name)

  constructor(@Inject(ServicesEnum.STORAGE_SERVICE) private readonly client: ClientProxy) {}

  public async get(type: StorageCommandEnum, referenceId: string): Promise<UploadFilesOutputDto> {
    try {
      const response = await firstValueFrom(
        this.client
          .send<UploadFilesOutputDto>({ cmd: 'get-file', type }, referenceId)
          .pipe(timeout(defaultTimeoutTcpRequest))
      )

      return response
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }

  public async upload(
    type: StorageCommandEnum,
    payload: UploadFileDto
  ): Promise<UploadFilesOutputDto> {
    try {
      const response = this.client
        .send<UploadFilesOutputDto>({ cmd: 'upload-file', type }, payload)
        .pipe(timeout(defaultTimeoutTcpRequest))

      const images = await firstValueFrom(response)

      return images
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }

  public async delete(type: StorageCommandEnum, referenceId: string): Promise<void> {
    try {
      this.client
        .emit<number>({ cmd: 'delete-file', type }, referenceId)
        .pipe(timeout(defaultTimeoutTcpRequest))
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }
}
