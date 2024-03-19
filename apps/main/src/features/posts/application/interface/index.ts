import { type CreatePostType } from '../../domain/entities/post.entity'
import { type Post } from '@prisma/client'

export abstract class IPostRepository {
  public abstract save: ({ authorId, imageId, content }: CreatePostType) => Promise<Post>
  public abstract find: (id: number) => Promise<Post | null>
  public abstract findMany: (id: number) => Promise<Post[] | null>
  public abstract update: (id: number, content: string | undefined) => Promise<void>
  public abstract delete: (id: number) => Promise<void>
}
