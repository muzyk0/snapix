import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IPostRepository } from '../interface'
import { NotFoundException } from '@nestjs/common'
import { isNil } from 'lodash'
import { IImageFilesFacade } from '../../../../core/adapters/storage/user-files.facede'

export class GetAllPostCommand {
  constructor(public readonly userId: number) {}
}

@CommandHandler(GetAllPostCommand)
export class GetAllPostHandler implements ICommandHandler<GetAllPostCommand> {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly storage: IImageFilesFacade
  ) {}

  async execute(dto: GetAllPostCommand) {
    const post = await this.postRepository.findMany(dto.userId)

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
