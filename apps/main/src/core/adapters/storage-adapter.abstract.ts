import { type ImageFileInfo } from '@app/core/types/dto'

export enum StorageCommandEnum {
  AVATAR = 'avatars',
}

export interface UploadAvatarParams {
  ownerId: string
  buffer: Buffer
  mimetype: string
  originalname: string
}

export abstract class IStorageAdapter {
  abstract get(type: StorageCommandEnum, ownerId: string): Promise<ImageFileInfo[]>

  abstract upload(type: StorageCommandEnum, payload: UploadAvatarParams): Promise<ImageFileInfo[]>

  abstract delete(type: StorageCommandEnum, ownerId: string): Promise<void>
}
