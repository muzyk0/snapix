import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IStorageAdapter } from '../../services/storage.adapter'
import { type User } from '@prisma/client'

export class DeleteAvatarCommand {
  constructor(readonly userId: User['id']) {}
}

@CommandHandler(DeleteAvatarCommand)
export class DeleteAvatarHandler implements ICommandHandler<DeleteAvatarCommand> {
  constructor(private readonly storage: IStorageAdapter) {}

  async execute({ userId }: DeleteAvatarCommand): Promise<void> {
    await this.storage.deleteAvatar(userId)
  }
}
