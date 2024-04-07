import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IPostRepository } from '../interface'
import { NotFoundException } from '@nestjs/common'
import { isNil } from 'lodash'
import { IImageFilesFacade } from '../../../../core/adapters/storage/user-files.facade'

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
    private readonly storage: IImageFilesFacade
  ) {}

  async execute(dto: GetAllUserPostsCommand) {
    const posts = await this.postRepository.findManyByUserId(dto.userId, dto.cursor, dto.pageSize)

    if (isNil(posts)) throw new NotFoundException()

    const referenceIds = posts.map(post => post.imageId)

    const images = await this.storage.getImages(referenceIds)

    const postsWithImages = posts.map(post => {
      const imageObjects = images.list.filter(image => image.referenceId === post.imageId)

      if (imageObjects.length > 0) {
        const photos = imageObjects.map(imageObject => ({
          referenceId: imageObject.referenceId,
          files: imageObject.files,
        }))

        return {
          id: post.id,
          content: post.content,
          authorId: post.authorId,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          photos,
        }
      } else {
        return {
          id: post.id,
          content: post.content,
          authorId: post.authorId,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          photos: [],
        }
      }
    })

    return postsWithImages
  }
}
