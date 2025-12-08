import { UploadImageHandler } from './upload-image.handler'
import { DeleteFileHandler } from './delete-file.handler'
import { GetFileHandler } from './get-file.handler'
import { GetFilesHandler } from './get-files.handler'

export const handlers = [GetFileHandler, GetFilesHandler, UploadImageHandler, DeleteFileHandler]
