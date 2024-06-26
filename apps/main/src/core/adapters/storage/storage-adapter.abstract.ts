import { type UploadFilesOutputDto } from '@app/core/types/dto'
import { type UploadImageDto } from '@app/core/types/dto/upload-image.dto'
import { type StorageCommandEnum } from '@app/core/enums/storage-command.enum'

export abstract class IStorageAdapter {
  abstract get(type: StorageCommandEnum, referenceId: string): Promise<UploadFilesOutputDto>

  abstract upload(type: StorageCommandEnum, payload: UploadImageDto): Promise<UploadFilesOutputDto>

  abstract delete(type: StorageCommandEnum, referenceId: string): Promise<boolean>
}
