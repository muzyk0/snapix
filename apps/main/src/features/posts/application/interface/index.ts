import { type CreatePostType } from '../../domain/entities/createPost.entity'
import { type Post } from '@prisma/client'

export abstract class IPostRepository {
  public abstract save: ({ authorId, photoId, content }: CreatePostType) => Promise<Post>
  public abstract find: (id: number) => Promise<Post | null>
}
