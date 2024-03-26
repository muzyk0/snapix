import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IPostRepository } from '../interface'
import { NotFoundException } from '@nestjs/common'
import { isNil } from 'lodash'
import { IImageFilesFacade } from '../../../../core/adapters/storage/user-files.facede'

export class GetPostCommand {
  constructor(public readonly postId: number) {}
}

@CommandHandler(GetPostCommand)
export class GetPostHandler implements ICommandHandler<GetPostCommand> {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly storage: IImageFilesFacade
  ) {}

  async execute(dto: GetPostCommand) {
    const post = await this.postRepository.find(dto.postId)

    if (isNil(post)) throw new NotFoundException()

    const photo = await this.storage.getImages(post.imageId)
    return {
      id: post.id,
      photoId: post.imageId,
      content: post.content,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      photo,
    }
  }
}
