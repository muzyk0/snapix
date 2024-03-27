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

export interface GetFileOutput {
  path: string
}

export abstract class IStorageAdapter {
  abstract get(key: string): Promise<GetFileOutput | null>

  abstract upload(payload: UploadFileParams): Promise<UploadFileOutput>

  abstract delete(key: string): Promise<void>

  abstract deleteMany(keys: string[]): Promise<void>

  abstract getFullPath(key: string): string
}
