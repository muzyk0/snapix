import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IPostRepository } from '../interface'
import { CreatePostEntity } from '../../domain/entities/createPost.entity'

export class CreatePostCommand {
  constructor(
    public readonly userId: number,
    public readonly content: string | undefined,
    public readonly photoId: string
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(dto: CreatePostCommand) {
    await this.postRepository.save(
      CreatePostEntity.createPost({
        authorId: dto.userId,
        photoId: dto.photoId,
        content: dto.content,
      })
    )
  }
}
