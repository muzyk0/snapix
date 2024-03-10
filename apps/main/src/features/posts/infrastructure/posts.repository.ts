import { Injectable } from '@nestjs/common'
import { PrismaService } from '@app/prisma'
import { type CreatePostType } from '../domain/entities/createPost.entity'
import { type IPostRepository } from '../application/interface'

@Injectable()
export class PostsRepository implements IPostRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async save(entity: CreatePostType): Promise<void> {
    await this.prisma.post.create({
      data: entity,
    })
  }
}
