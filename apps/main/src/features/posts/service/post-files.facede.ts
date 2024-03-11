import { Injectable } from '@nestjs/common'
import {
  IStorageAdapter,
  StorageCommandEnum,
  type UploadPhotoToPostParams,
} from '../../../core/adapters/storage-adapter.abstract'
import { type ImageFileInfo } from '@app/core/types/dto'

export abstract class IPostFilesFacade {
  // abstract getAvatar(userId: User['id']): Promise<ImageFileInfo[]>

  abstract uploadPhotoToPost(payload: UploadPhotoToPostParams): Promise<ImageFileInfo[]>

  abstract deleteAvatar(photoId: string): Promise<void>
}

@Injectable()
export class PostFilesFacade implements IPostFilesFacade {
  constructor(private readonly storage: IStorageAdapter) {}

  /* public async getAvatar(userId: User['id']): Promise<ImageFileInfo[]> {
        return this.storage.get(StorageCommandEnum.AVATAR, String(userId))
    } */

  public async uploadPhotoToPost(payload: UploadPhotoToPostParams): Promise<ImageFileInfo[]> {
    return this.storage.uploadPhotoToPost(StorageCommandEnum.POST, payload)
  }

  public async deleteAvatar(photoId: string): Promise<void> {
    return this.storage.delete(StorageCommandEnum.AVATAR, photoId)
  }
}
