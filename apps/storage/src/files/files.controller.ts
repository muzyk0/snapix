import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { CommandBus } from '@nestjs/cqrs'
import { UploadAvatarFileCommand } from './application/use-cases/upload-file.handler'
import { UploadAvatarDto } from './controllers/upload-avatar.dto'
import type { UploadAvatarViewDto } from '@app/core/types/dto/upload-avatar-view.dto'
import { StorageCommandEnum } from './adapters/storage-adapter.abstract'

@Controller('files')
export class FilesController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern({ cmd: 'upload-file', type: StorageCommandEnum.AVATAR })
  async uploadAvatar(payload: UploadAvatarDto): Promise<any> {
    const data = await this.commandBus.execute<UploadAvatarFileCommand, UploadAvatarViewDto>(
      new UploadAvatarFileCommand(payload)
    )

    return data
  }
}
