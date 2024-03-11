import { CreatePostHandler } from './create-post.handler'
import { GetPostHandler } from './get-post.handler'
import { UpdatePostHandler } from './update-post.handler'

export const postHandlers = [CreatePostHandler, GetPostHandler, UpdatePostHandler]
