import { Injectable } from '@nestjs/common'
import { PrismaService } from '@app/prisma'
import { type CreatePostType } from '../domain/entities/createPost.entity'
import { type IPostRepository } from '../application/interface'
import { type Post } from '@prisma/client'

@Injectable()
export class PostsRepository implements IPostRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async save(entity: CreatePostType): Promise<Post> {
    return this.prisma.post.create({
      data: entity,
    })
  }

  public async find(postId: number): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    })
  }
}
