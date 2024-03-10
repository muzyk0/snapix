import type { Post, User } from '@prisma/client'
import { AggregateRoot } from '@nestjs/cqrs'

export interface CreatePostType {
  userId: User['id']
  photoId: string
  content: string | undefined
}

export class CreatePostEntity extends AggregateRoot implements Partial<Post> {
  userId!: number
  photoId: string
  content: string | undefined

  constructor({ userId, photoId, content }: CreatePostType) {
    super()

    this.userId = userId
    this.photoId = photoId
    this.content = content
  }

  static createPost({ userId, photoId, content }: CreatePostType): CreatePostEntity {
    return new CreatePostEntity({ userId, photoId, content })
  }
}
