import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { CommandBus } from '@nestjs/cqrs'
import { UploadAvatarFileCommand } from './application/use-cases/upload-file.handler'
import { UploadAvatarDto } from './controllers/upload-avatar.dto'
import type { UploadAvatarViewDto } from '@app/core/types/dto/upload-avatar-view.dto'
import { StorageCommandEnum } from './adapters/storage-adapter.abstract'
import { Cron, CronExpression } from '@nestjs/schedule'
import { DeleteAvatarFileCommand } from './application/use-cases/delete-file.handler'

@Controller('files')
export class FilesController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern({ cmd: 'upload-file', type: StorageCommandEnum.AVATAR })
  async uploadAvatar(payload: UploadAvatarDto): Promise<UploadAvatarViewDto> {
    const data = await this.commandBus.execute<UploadAvatarFileCommand, UploadAvatarViewDto>(
      new UploadAvatarFileCommand(payload)
    )

    return data
  }

  @MessagePattern({ cmd: 'delete-file', type: StorageCommandEnum.AVATAR })
  async deleteAvatar(ownerId: string): Promise<boolean> {
    await this.commandBus.execute<DeleteAvatarFileCommand, undefined>(
      new DeleteAvatarFileCommand(ownerId)
    )

    return true
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  deleteAvatars() {
    // TODO: Сделать удаление аватарок если их больше N каждый день.
  }
}
