import { UploadFileHandler } from './upload-file.handler'
import { DeleteFileHandler } from './delete-file.handler'
import { GetFileHandler } from './get-file.handler'

export const handlers = [GetFileHandler, UploadFileHandler, DeleteFileHandler]
