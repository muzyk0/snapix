import { Injectable } from '@nestjs/common'
import { type User } from '@prisma/client'
import {
  IStorageAdapter,
  StorageCommandEnum,
  type UploadAvatarParams,
} from '../../../core/adapters/storage-adapter.abstract'
import { type ImageFileInfo } from '@app/core/types/dto'

export abstract class IUserFilesFacade {
  abstract uploadAvatar(payload: UploadAvatarParams): Promise<ImageFileInfo[]>

  abstract deleteAvatar(userId: User['id']): Promise<void>
}

@Injectable()
export class UserFilesFacade implements IUserFilesFacade {
  constructor(private readonly storage: IStorageAdapter) {}

  public async uploadAvatar(payload: UploadAvatarParams): Promise<ImageFileInfo[]> {
    return this.storage.upload(StorageCommandEnum.AVATAR, payload)
  }

  public async deleteAvatar(userId: User['id']): Promise<void> {
    return this.storage.delete(StorageCommandEnum.AVATAR, String(userId))
  }
}
