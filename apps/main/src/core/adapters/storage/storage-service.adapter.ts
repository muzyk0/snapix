import { Inject, Injectable, Logger } from '@nestjs/common'
import { type IStorageAdapter } from './storage-adapter.abstract'
import { ClientProxy } from '@nestjs/microservices'
import { defaultTimeoutTcpRequest, ServicesEnum } from '@app/core/constants'
import { firstValueFrom, timeout } from 'rxjs'
import { type UploadFilesOutputDto } from '@app/core/types/dto'
import { type UploadImageDto } from '@app/core/types/dto/upload-image.dto'
import { type StorageCommandEnum } from '@app/core/enums/storage-command.enum'

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
    payload: UploadImageDto
  ): Promise<UploadFilesOutputDto> {
    try {
      const response = this.client.send<UploadFilesOutputDto>({ cmd: 'upload-file', type }, payload)
      // .pipe(timeout(defaultTimeoutTcpRequest))

      const images = await firstValueFrom(response)

      return images
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }

  public async delete(type: StorageCommandEnum, referenceId: string): Promise<boolean> {
    try {
      this.client
        .emit<number>({ cmd: 'delete-file', type }, referenceId)
        .pipe(timeout(defaultTimeoutTcpRequest))

      return true
    } catch (e) {
      this.logger.error(e)
      return false
    }
  }
}
