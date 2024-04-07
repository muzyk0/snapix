import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { IPostRepository } from '../interface'
import { NotFoundException } from '@nestjs/common'
import { isNil } from 'lodash'
import { IImageFilesFacade } from '../../../../core/adapters/storage/user-files.facade'

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
    private readonly storage: IImageFilesFacade
  ) {}

  async execute(dto: GetAllPostsCommand) {
    const posts = await this.postRepository.findMany(dto.cursor, dto.pageSize)

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
