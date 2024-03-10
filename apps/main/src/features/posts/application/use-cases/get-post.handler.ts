import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IPostRepository } from '../interface'
import { NotFoundException } from '@nestjs/common'

export class GetPostCommand {
  constructor(public readonly postId: number) {}
}

@CommandHandler(GetPostCommand)
export class GetPostHandler implements ICommandHandler<GetPostCommand> {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(dto: GetPostCommand) {
    const post = await this.postRepository.find(dto.postId)
    // toDo: find photo and send instead of id
    if (!post) throw new NotFoundException()
    return {
      id: post.id,
      photoId: post.photoId,
      content: post.content,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }
  }
}
