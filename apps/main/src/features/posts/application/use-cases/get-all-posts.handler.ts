import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IPostRepository } from '../interface'
import { NotFoundException } from '@nestjs/common'
import { isNil } from 'lodash'
import { PostsService } from '../posts.service'

export class GetAllPostsCommand {
  constructor(
    public readonly cursor: number | undefined,
    public readonly pageSize: number | undefined
  ) {}
}

@CommandHandler(GetAllPostsCommand)
export class GetAllPostsHandler implements ICommandHandler<GetAllPostsCommand> {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly postsService: PostsService
  ) {}

  async execute(dto: GetAllPostsCommand) {
    const posts = await this.postRepository.findMany(dto.cursor, dto.pageSize)

    if (isNil(posts)) throw new NotFoundException()

    return this.postsService.mapImagesWithPosts(posts)
  }
}
