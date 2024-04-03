import { Injectable } from '@nestjs/common'
import { type UploadFilesOutputDto } from '@app/core/types/dto'
import { IStorageAdapter } from './storage-adapter.abstract'
import { type UploadImageDto } from '@app/core/types/dto/upload-image.dto'
import { StorageCommandEnum } from '@app/core/enums/storage-command.enum'

export abstract class IImageFilesFacade {
  abstract getImages(referenceId: string): Promise<UploadFilesOutputDto>

  abstract uploadImage(payload: UploadImageDto): Promise<UploadFilesOutputDto>

  abstract deleteImage(referenceId: string): Promise<boolean>
}

@Injectable()
export class ImageFilesFacade implements IImageFilesFacade {
  constructor(private readonly storage: IStorageAdapter) {}

  public async getImages(referenceId: string): Promise<UploadFilesOutputDto> {
    return this.storage.get(StorageCommandEnum.IMAGE, referenceId)
  }

  public async uploadImage(payload: UploadImageDto): Promise<UploadFilesOutputDto> {
    return this.storage.upload(StorageCommandEnum.IMAGE, payload)
  }

  public async deleteImage(referenceId: string): Promise<boolean> {
    return this.storage.delete(StorageCommandEnum.IMAGE, referenceId)
  }
}
