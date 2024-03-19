import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { UploadFileCommand } from '../application/use-cases/upload-file.handler'
import { UploadFileDto } from '@app/core/types/dto/upload-file.dto'
import type { UploadFilesOutputDto } from '@app/core/types/dto/upload-files.dto'
import { StorageCommandEnum } from '../adapters/storage-adapter.abstract'
import { DeleteAvatarFileCommand } from '../application/use-cases/delete-file.handler'
import { GetFileQuery } from '../application/use-cases/get-file.handler'

@Controller('files')
export class FilesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @MessagePattern({ cmd: 'get-file', type: StorageCommandEnum.AVATAR })
  async getAvatar(referenceId: string): Promise<UploadFilesOutputDto> {
    return await this.queryBus.execute<GetFileQuery, UploadFilesOutputDto>(
      new GetFileQuery(StorageCommandEnum.AVATAR, referenceId)
    )
  }

  @MessagePattern({ cmd: 'upload-file', type: StorageCommandEnum.AVATAR })
  async uploadAvatar(payload: UploadFileDto): Promise<UploadFilesOutputDto> {
    return await this.commandBus.execute<UploadFileCommand, UploadFilesOutputDto>(
      new UploadFileCommand(StorageCommandEnum.AVATAR, payload)
    )
  }

  @MessagePattern({ cmd: 'delete-file', type: StorageCommandEnum.AVATAR })
  async deleteAvatar(ownerId: string): Promise<boolean> {
    await this.commandBus.execute<DeleteAvatarFileCommand, undefined>(
      new DeleteAvatarFileCommand(StorageCommandEnum.AVATAR, ownerId)
    )

    return true
  }
}
