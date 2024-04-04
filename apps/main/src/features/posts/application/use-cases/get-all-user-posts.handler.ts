import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IPostRepository } from '../interface'
import { NotFoundException } from '@nestjs/common'
import { isNil } from 'lodash'
import { IImageFilesFacade } from '../../../../core/adapters/storage/user-files.facade'

export class GetAllUserPostsCommand {
  constructor(
    public readonly userId: number,
    public readonly cursor: number,
    public readonly pageSize: number
  ) {}
}

@CommandHandler(GetAllUserPostsCommand)
export class GetAllUserPostsHandler implements ICommandHandler<GetAllUserPostsCommand> {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly storage: IImageFilesFacade
  ) {}

  async execute(dto: GetAllUserPostsCommand) {
    const post = await this.postRepository.findManyByUserId(
      dto.userId,
      dto.cursor,
      dto.pageSize ?? 10
    )

    if (isNil(post)) throw new NotFoundException()

    return Promise.all(
      post.map(async p => {
        return {
          id: p.id,
          photoId: p.imageId,
          content: p.content,
          authorId: p.authorId,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          photo: await this.storage.getImages(p.imageId),
        }
      })
    )
  }
}
