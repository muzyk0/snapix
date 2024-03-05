import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { type UploadAvatarViewDto } from '../dto/upload-avatar-view.dto'
import { IStorageAdapter } from '../../services/storage.adapter'
import { type User } from '@prisma/client'

export class UploadAvatarCommand {
  constructor(
    readonly userId: User['id'],
    readonly file: Express.Multer.File
  ) {}
}

@CommandHandler(UploadAvatarCommand)
export class UploadAvatarHandler implements ICommandHandler<UploadAvatarCommand> {
  constructor(private readonly storage: IStorageAdapter) {}

  async execute({ userId, file }: UploadAvatarCommand): Promise<UploadAvatarViewDto> {
    const result = await this.storage.uploadAvatar(userId, file)

    return {
      avatars: [
        {
          url: result.path,
          width: 300,
          height: 300,
          size: 300,
        },
      ],
    }
  }
}
