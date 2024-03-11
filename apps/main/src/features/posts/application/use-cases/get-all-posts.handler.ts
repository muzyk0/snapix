import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IPostRepository } from '../interface'
import { NotFoundException } from '@nestjs/common'
import { IPostFilesFacade } from '../../service/post-files.facede'
import { isNil } from 'lodash'

export class GetAllPostCommand {
  constructor(public readonly userId: number) {}
}

@CommandHandler(GetAllPostCommand)
export class GetAllPostHandler implements ICommandHandler<GetAllPostCommand> {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly storage: IPostFilesFacade
  ) {}

  async execute(dto: GetAllPostCommand) {
    const post = await this.postRepository.findMany(dto.userId)

    if (isNil(post)) throw new NotFoundException()
    // const photo = this.storage.getPhotoToPost(post.photoId)
    return Promise.all(
      post.map(async p => {
        return {
          id: p.id,
          photoId: p.photoId,
          content: p.content,
          authorId: p.authorId,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          photo: await this.storage.getPhotoToPost(p.photoId),
        }
      })
    )
  }
}
