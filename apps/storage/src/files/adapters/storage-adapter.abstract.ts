export enum StorageCommandEnum {
  AVATAR = 'avatars',
}

export interface UploadFileParams {
  dirKey: string
  buffer: Buffer
  mimetype: string
}

export interface UploadFileOutput {
  path: string
  key: string
  ETag: string
}

export abstract class IStorageAdapter {
  abstract upload(payload: UploadFileParams): Promise<UploadFileOutput>

  abstract delete(key: string): Promise<void>
}
