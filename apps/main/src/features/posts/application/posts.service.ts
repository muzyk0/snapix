import { Injectable } from '@nestjs/common'
import { IImageFilesFacade } from '../../../core/adapters/storage/user-files.facade'
import { type Post } from '@prisma/client'

@Injectable()
export class PostsService {
  constructor(private readonly storage: IImageFilesFacade) {}

  async mapImagesWithPosts(posts: Post[]) {
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
