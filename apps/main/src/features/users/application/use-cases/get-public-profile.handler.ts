import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PrismaService } from '@app/prisma'
import { BadRequestException } from '@nestjs/common'
import { isNil } from 'lodash'
import { type PublicProfileViewDto } from '../dto/public-profile-view.dto'

export class GetPublicProfileQuery {
  constructor(public readonly userId: number) {}
}

@QueryHandler(GetPublicProfileQuery)
export class GetPublicProfileHandler implements IQueryHandler<GetPublicProfileQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: GetPublicProfileQuery): Promise<PublicProfileViewDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: dto.userId,
      },
      include: {
        profile: true,
      },
    })
    if (isNil(user)) {
      throw new BadRequestException()
    }

    return {
      id: user.id,
      userName: user.name,
      aboutMe: user.profile.aboutMe,
    }
  }
}
