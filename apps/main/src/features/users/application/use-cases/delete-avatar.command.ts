import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { type User } from '@prisma/client'
import { IUserFilesFacade } from '../../services/user-files.facede'

export class DeleteAvatarCommand {
  constructor(readonly userId: User['id']) {}
}

@CommandHandler(DeleteAvatarCommand)
export class DeleteAvatarHandler implements ICommandHandler<DeleteAvatarCommand> {
  constructor(private readonly storage: IUserFilesFacade) {}

  async execute({ userId }: DeleteAvatarCommand): Promise<void> {
    await this.storage.deleteAvatar(userId)
  }
}
