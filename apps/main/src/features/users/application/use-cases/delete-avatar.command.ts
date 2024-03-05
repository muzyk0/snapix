import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { IStorageAdapter } from '../../services/storage.adapter'
import { type User } from '@prisma/client'

export class DeleteAvatarCommand {
  constructor(readonly userId: User['id']) {}
}

@QueryHandler(DeleteAvatarCommand)
export class DeleteAvatarHandler implements IQueryHandler<DeleteAvatarCommand> {
  constructor(private readonly storage: IStorageAdapter) {}

  async execute({ userId }: DeleteAvatarCommand): Promise<void> {
    await this.storage.deleteAvatar(userId)
  }
}
