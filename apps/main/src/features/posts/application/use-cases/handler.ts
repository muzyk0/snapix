import { CreatePostHandler } from './create-post.handler'
import { GetPostHandler } from './get-post.handler'
import { UpdatePostHandler } from './update-post.handler'
import { UploadPhotoToPostHandler } from './upload-photo-to-post.handler'
import { DeletePostHandler } from './delete-post.handler'
import { GetAllUserPostsHandler } from './get-all-user-posts.handler'

export const postHandlers = [
  CreatePostHandler,
  GetPostHandler,
  UpdatePostHandler,
  UploadPhotoToPostHandler,
  DeletePostHandler,
  GetAllUserPostsHandler,
]
