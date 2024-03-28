import { UploadImageHandler } from './upload-image.handler'
import { DeleteFileHandler } from './delete-file.handler'
import { GetFileHandler } from './get-file.handler'

export const handlers = [GetFileHandler, UploadImageHandler, DeleteFileHandler]
