import type { Post, User } from '@prisma/client'
import { AggregateRoot } from '@nestjs/cqrs'

export interface CreatePostType {
  authorId: User['id']
  photoId: string
  content: string | undefined
}

export class CreatePostEntity extends AggregateRoot implements Partial<Post> {
  authorId!: number
  photoId: string
  content: string | undefined

  constructor({ authorId, photoId, content }: CreatePostType) {
    super()

    this.authorId = authorId
    this.photoId = photoId
    this.content = content
  }

  static createPost({ authorId, photoId, content }: CreatePostType): CreatePostEntity {
    return new CreatePostEntity({ authorId, photoId, content })
  }
}
