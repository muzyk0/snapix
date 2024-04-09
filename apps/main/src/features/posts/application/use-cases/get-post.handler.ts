import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IPostRepository } from '../interface'
import { NotFoundException } from '@nestjs/common'
import { isNil } from 'lodash'
import { PostsService } from '../posts.service'

export class GetPostCommand {
  constructor(public readonly postId: number) {}
}

@CommandHandler(GetPostCommand)
export class GetPostHandler implements ICommandHandler<GetPostCommand> {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly postsService: PostsService
  ) {}

  async execute(dto: GetPostCommand) {
    const post = await this.postRepository.find(dto.postId)

    if (isNil(post)) throw new NotFoundException()

    return this.postsService.mapImagesWithPosts([post])
  }
}
