import { Injectable } from '@nestjs/common'
import { type User } from '@prisma/client'
import { type UploadFilesViewDto } from '@app/core/types/dto'
import {
  IStorageAdapter,
  StorageCommandEnum,
} from '../../../core/adapters/storage/storage-adapter.abstract'
import { type UploadFileDto } from '@app/core/types/dto/upload-file.dto'

export abstract class IUserFilesFacade {
  abstract getAvatar(userId: User['id']): Promise<UploadFilesViewDto>

  abstract uploadAvatar(payload: UploadFileDto): Promise<UploadFilesViewDto>

  abstract deleteAvatar(userId: User['id']): Promise<void>
}

@Injectable()
export class UserFilesFacade implements IUserFilesFacade {
  constructor(private readonly storage: IStorageAdapter) {}

  public async getAvatar(userId: User['id']): Promise<UploadFilesViewDto> {
    return this.storage.get(StorageCommandEnum.AVATAR, String(userId))
  }

  public async uploadAvatar(payload: UploadFileDto): Promise<UploadFilesViewDto> {
    return this.storage.upload(StorageCommandEnum.AVATAR, payload)
  }

  public async deleteAvatar(userId: User['id']): Promise<void> {
    return this.storage.delete(StorageCommandEnum.AVATAR, String(userId))
  }
}
