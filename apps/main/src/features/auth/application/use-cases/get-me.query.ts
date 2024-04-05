import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PrismaService } from '@app/prisma'
import { type User } from '@prisma/client'
import { UnauthorizedException } from '@nestjs/common'
import { type MeViewDto } from '../dto/me-view.dto'

export class GetMeQuery {
  constructor(readonly userId: User['id']) {}
}

@QueryHandler(GetMeQuery)
export class GetMeHandler implements IQueryHandler<GetMeQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ userId }: GetMeQuery): Promise<MeViewDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new UnauthorizedException()
    }

    return {
      userId,
      username: user.name,
      email: user.email,
    }
  }
}
