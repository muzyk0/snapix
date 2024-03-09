import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { UploadAvatarFileCommand } from '../application/use-cases/upload-file.handler'
import { UploadAvatarDto } from './dto/upload-avatar.dto'
import type { UploadAvatarViewDto } from '@app/core/types/dto/upload-avatar-view.dto'
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
  async getAvatar(ownerId: string): Promise<UploadAvatarViewDto> {
    return await this.queryBus.execute<GetFileQuery, UploadAvatarViewDto>(
      new GetFileQuery(StorageCommandEnum.AVATAR, ownerId)
    )
  }

  @MessagePattern({ cmd: 'upload-file', type: StorageCommandEnum.AVATAR })
  async uploadAvatar(payload: UploadAvatarDto): Promise<UploadAvatarViewDto> {
    return await this.commandBus.execute<UploadAvatarFileCommand, UploadAvatarViewDto>(
      new UploadAvatarFileCommand(StorageCommandEnum.AVATAR, payload)
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
