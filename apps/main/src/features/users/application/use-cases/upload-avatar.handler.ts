import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IUserFilesFacade } from '../../services/user-files.facede'
import { type UploadAvatarParams } from '../../../../core/adapters/storage-adapter.abstract'
import { type UploadAvatarViewDto } from '@app/core/types/dto'

export class UploadAvatarCommand {
  constructor(readonly payload: UploadAvatarParams) {}
}

@CommandHandler(UploadAvatarCommand)
export class UploadAvatarHandler implements ICommandHandler<UploadAvatarCommand> {
  constructor(private readonly storage: IUserFilesFacade) {}

  async execute({ payload }: UploadAvatarCommand): Promise<UploadAvatarViewDto> {
    const imageFiles = await this.storage.uploadAvatar(payload)

    return {
      avatars: imageFiles,
    }
  }
}
