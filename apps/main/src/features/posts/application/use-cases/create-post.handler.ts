import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IPostRepository } from '../interface'
import { PostEntity } from '../../domain/entities/post.entity'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CreatePostWithImageEvent } from '../../domain/events/create-post-with-image.event'
import type { Post } from '@prisma/client'
import { IImageFilesFacade } from '../../../../core/adapters/storage/user-files.facade'
import { isNil } from 'lodash'
import { NotFoundException } from '@nestjs/common'

export class CreatePostCommand {
  constructor(
    public readonly userId: number,
    public readonly content: string | undefined,
    public readonly imageId: string
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly storage: IImageFilesFacade
  ) {}

  // fixme: Исправить Partial<Post> и написать View DTO
  async execute(dto: CreatePostCommand): Promise<Partial<Post>> {
    const image = await this.storage.getImages(dto.imageId)
    if (isNil(image)) throw new NotFoundException('Image not found')

    const post = await this.postRepository.save(
      PostEntity.createPost({
        authorId: dto.userId,
        imageId: dto.imageId,
        content: dto.content,
      })
    )

    this.eventEmitter.emit('post.create', new CreatePostWithImageEvent(post))

    return {
      id: post.id,
      imageId: post.imageId,
      content: post.content,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }
  }
}
