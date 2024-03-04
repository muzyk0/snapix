import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { type UploadAvatarDtoView } from '../dto/upload-avatar.dto.view'
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

  async execute({ userId, file }: UploadAvatarCommand): Promise<UploadAvatarDtoView> {
    console.log(file)

    const result = await this.storage.uploadAvatar(userId, file)

    console.log(result)
    return {
      avatars: [],
    }
  }
}
