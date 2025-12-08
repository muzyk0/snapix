export class CreatePostViewDto {
  id: number
  imageId: string[]
  content: string | null
  authorId: number
  createdAt: Date
  updatedAt: Date
  constructor(
    id: number,
    imageId: string[],
    content: string | null,
    authorId: number,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id
    this.imageId = imageId
    this.content = content
    this.authorId = authorId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
