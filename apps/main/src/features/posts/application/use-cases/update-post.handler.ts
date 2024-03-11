import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IPostRepository } from '../interface'

export class UpdatePostCommand {
  constructor(
    public readonly postId: number,
    public readonly content: string | undefined
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(dto: UpdatePostCommand): Promise<void> {
    await this.postRepository.update(dto.postId, dto.content)
  }
}
