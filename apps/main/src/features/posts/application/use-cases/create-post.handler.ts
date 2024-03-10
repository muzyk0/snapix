import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '@app/prisma'

export class CreatePostCommand {
  constructor(
    public readonly userId: number,
    public readonly content: string | undefined
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreatePostCommand) {
    // in process...
  }
}
