import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IUserFilesFacade } from '../../services/user-files.facede'
import { type User } from '@prisma/client'
import { PrismaService } from '@app/prisma'

export class DeleteAvatarCommand {
  constructor(readonly userId: User['id']) {}
}

@CommandHandler(DeleteAvatarCommand)
export class DeleteAvatarHandler implements ICommandHandler<DeleteAvatarCommand> {
  constructor(
    private readonly storage: IUserFilesFacade,
    private readonly prisma: PrismaService
  ) {}

  async execute({ userId }: DeleteAvatarCommand): Promise<void> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        profile: true,
      },
    })

    if (user.profile.avatarId) {
      await this.storage.deleteAvatar(user.profile.avatarId)
    }
  }
}
