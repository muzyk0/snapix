import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IPostRepository } from '../interface'
import { NotFoundException } from '@nestjs/common'
import { isNil } from 'lodash'
import { IImageFilesFacade } from '../../../../core/adapters/storage/user-files.facade'

export class DeletePostCommand {
  constructor(public readonly postId: number) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly storage: IImageFilesFacade
  ) {}

  async execute(dto: DeletePostCommand): Promise<void> {
    const post = await this.postRepository.find(dto.postId)
    if (isNil(post)) throw new NotFoundException()

    // delete post and photo
    await this.postRepository.delete(dto.postId)
    await this.storage.deleteImage(post.imageId)
  }
}
