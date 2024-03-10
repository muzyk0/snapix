import { type CreatePostType } from '../../domain/entities/createPost.entity'

export abstract class IPostRepository {
  public abstract save: ({ userId, photoId, content }: CreatePostType) => Promise<void>
}
