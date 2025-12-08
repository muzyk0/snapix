import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IPostRepository } from '../interface'
import { NotFoundException } from '@nestjs/common'
import { isNil } from 'lodash'
import { PostsService } from '../posts.service'

export class GetAllUserPostsCommand {
  constructor(
    public readonly userId: number,
    public readonly cursor: number | undefined,
    public readonly pageSize: number | undefined
  ) {}
}

@CommandHandler(GetAllUserPostsCommand)
export class GetAllUserPostsHandler implements ICommandHandler<GetAllUserPostsCommand> {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly postsService: PostsService
  ) {}

  async execute(dto: GetAllUserPostsCommand) {
    const posts = await this.postRepository.findManyByUserId(dto.userId, dto.cursor, dto.pageSize)

    if (isNil(posts)) throw new NotFoundException()

    return this.postsService.mapImagesWithPosts(posts)
  }
}
