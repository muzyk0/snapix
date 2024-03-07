export enum StorageCommandEnum {
  AVATAR = 'avatars',
}

export interface UploadFileParams {
  dirKey: string
  buffer: Buffer
  mimetype: string
}

export abstract class IStorageAdapter {
  abstract upload(payload: UploadFileParams): Promise<{ path: string }>

  abstract delete(type: StorageCommandEnum, ownerId: string): Promise<void>
}
