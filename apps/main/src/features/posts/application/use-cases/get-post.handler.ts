import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IPostRepository } from '../interface'
import { NotFoundException } from '@nestjs/common'
import { IPostFilesFacade } from '../../service/post-files.facede'

export class GetPostCommand {
  constructor(public readonly postId: number) {}
}

@CommandHandler(GetPostCommand)
export class GetPostHandler implements ICommandHandler<GetPostCommand> {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly storage: IPostFilesFacade
  ) {}

  async execute(dto: GetPostCommand) {
    const post = await this.postRepository.find(dto.postId)

    if (!post) throw new NotFoundException()

    const photo = this.storage.getPhotoToPost(post.photoId)
    return {
      id: post.id,
      photoId: post.photoId,
      content: post.content,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      photo,
    }
  }
}
