import { Injectable } from '@nestjs/common'
import {
  IStorageAdapter,
  StorageCommandEnum,
} from '../../../core/adapters/storage/storage-adapter.abstract'
import { type UploadFileDto } from '@app/core/types/dto/upload-file.dto'
import { type UploadFilesOutputDto } from '@app/core/types/dto'

export abstract class IPostFilesFacade {
  abstract getPhotoToPost(photoId: string): Promise<UploadFilesOutputDto>

  abstract uploadPhotoToPost(payload: UploadFileDto): Promise<UploadFilesOutputDto>

  abstract deletePhotoToPost(photoId: string): Promise<void>
}

@Injectable()
export class PostFilesFacade implements IPostFilesFacade {
  constructor(private readonly storage: IStorageAdapter) {}

  public async getPhotoToPost(photoId: string): Promise<UploadFilesOutputDto> {
    return this.storage.get(StorageCommandEnum.POST, photoId)
  }

  public async uploadPhotoToPost(payload: UploadFileDto): Promise<UploadFilesOutputDto> {
    return this.storage.upload(StorageCommandEnum.POST, payload)
  }

  public async deletePhotoToPost(photoId: string): Promise<void> {
    return this.storage.delete(StorageCommandEnum.POST, photoId)
  }
}
