import { Injectable } from '@nestjs/common'
import { type UploadFilesOutputDto } from '@app/core/types/dto'
import {
  IStorageAdapter,
  StorageCommandEnum,
} from '../../../core/adapters/storage/storage-adapter.abstract'
import { type UploadFileDto } from '@app/core/types/dto/upload-file.dto'

export abstract class IUserFilesFacade {
  abstract getAvatar(referenceId: string): Promise<UploadFilesOutputDto>

  abstract uploadAvatar(payload: UploadFileDto): Promise<UploadFilesOutputDto>

  abstract deleteAvatar(referenceId: string): Promise<boolean>
}

@Injectable()
export class UserFilesFacade implements IUserFilesFacade {
  constructor(private readonly storage: IStorageAdapter) {}

  public async getAvatar(referenceId: string): Promise<UploadFilesOutputDto> {
    return this.storage.get(StorageCommandEnum.AVATAR, referenceId)
  }

  public async uploadAvatar(payload: UploadFileDto): Promise<UploadFilesOutputDto> {
    return this.storage.upload(StorageCommandEnum.AVATAR, payload)
  }

  public async deleteAvatar(referenceId: string): Promise<boolean> {
    return this.storage.delete(StorageCommandEnum.AVATAR, referenceId)
  }
}
