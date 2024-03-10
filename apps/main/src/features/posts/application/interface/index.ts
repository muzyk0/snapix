import { type CreatePostType } from '../../domain/entities/createPost.entity'

export abstract class IPostRepository {
  public abstract save: ({ authorId, photoId, content }: CreatePostType) => Promise<void>
}
