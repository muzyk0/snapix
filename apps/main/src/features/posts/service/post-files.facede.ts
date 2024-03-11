import { Injectable } from '@nestjs/common'
import {
  IStorageAdapter,
  StorageCommandEnum,
  type UploadPhotoToPostParams,
} from '../../../core/adapters/storage-adapter.abstract'
import { type ImageFileInfo } from '@app/core/types/dto'

export abstract class IPostFilesFacade {
  abstract getPhotoToPost(photoId: string): Promise<ImageFileInfo[]>

  abstract uploadPhotoToPost(payload: UploadPhotoToPostParams): Promise<ImageFileInfo[]>

  abstract deletePhotoToPost(photoId: string): Promise<void>
}

@Injectable()
export class PostFilesFacade implements IPostFilesFacade {
  constructor(private readonly storage: IStorageAdapter) {}

  public async getPhotoToPost(photoId: string): Promise<ImageFileInfo[]> {
    return this.storage.getPhotoToPost(StorageCommandEnum.POST, photoId)
  }

  public async uploadPhotoToPost(payload: UploadPhotoToPostParams): Promise<ImageFileInfo[]> {
    return this.storage.uploadPhotoToPost(StorageCommandEnum.POST, payload)
  }

  public async deletePhotoToPost(photoId: string): Promise<void> {
    return this.storage.deletePhotoToPost(StorageCommandEnum.POST, photoId)
  }
}
