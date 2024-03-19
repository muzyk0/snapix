import type { Post, User } from '@prisma/client'
import { AggregateRoot } from '@nestjs/cqrs'

export interface CreatePostType {
  authorId: User['id']
  imageId: string
  content: string | undefined
}

export class PostEntity extends AggregateRoot implements Partial<Post> {
  authorId!: number
  imageId: string
  content: string | undefined

  constructor({ authorId, imageId, content }: CreatePostType) {
    super()

    this.authorId = authorId
    this.imageId = imageId
    this.content = content
  }

  static createPost({ authorId, imageId, content }: CreatePostType): PostEntity {
    return new PostEntity({ authorId, imageId, content })
  }
}
