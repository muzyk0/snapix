import { type Post } from '@prisma/client'

export class CreatePostWithImageEvent {
  constructor(public readonly post: Post) {}
}
