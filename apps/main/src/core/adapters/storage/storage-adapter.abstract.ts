import { type UploadFilesOutputDto } from '@app/core/types/dto'
import { type UploadFileDto } from '@app/core/types/dto/upload-file.dto'

export enum StorageCommandEnum {
  AVATAR = 'avatars',
  POST = 'posts',
}

export abstract class IStorageAdapter {
  abstract get(type: StorageCommandEnum, ownerId: string): Promise<UploadFilesOutputDto>

  abstract upload(type: StorageCommandEnum, payload: UploadFileDto): Promise<UploadFilesOutputDto>

  abstract delete(type: StorageCommandEnum, ownerId: string): Promise<void>
}
