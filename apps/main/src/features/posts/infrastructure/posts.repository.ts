import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@app/prisma'
import { type CreatePostType } from '../domain/entities/post.entity'
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

  public async findManyByUserId(
    userId: number,
    cursor: number | undefined,
    pageSize: number | undefined
  ): Promise<Post[] | null> {
    const offset = cursor ? { id: cursor } : undefined
    return this.prisma.post.findMany({
      where: {
        authorId: userId,
        ...(offset && { id: { gt: offset.id } }),
      },
      take: pageSize ?? 10,
      orderBy: { id: 'asc' },
      include: { comments: true },
    })
  }

  public async findMany(
    cursor: number | undefined,
    pageSize: number | undefined
  ): Promise<Post[] | null> {
    const offset = cursor ? { id: cursor } : undefined
    return this.prisma.post.findMany({
      where: {
        ...(offset && { id: { gt: offset.id } }),
      },
      take: pageSize ?? 10,
      orderBy: { id: 'asc' },
      include: { comments: true },
    })
  }

  public async update(postId: number, content: string | undefined): Promise<void> {
    try {
      await this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          content,
        },
      })
    } catch (error) {
      if (error instanceof Error && error.message.includes('Record to update not found')) {
        throw new NotFoundException()
      } else {
        throw error
      }
    }
  }

  public async delete(postId: number): Promise<void> {
    await this.prisma.post.delete({
      where: {
        id: postId,
      },
    })
  }
}
