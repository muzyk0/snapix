import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PrismaService } from '@app/prisma'
import { BadRequestException } from '@nestjs/common'
import { isNil } from 'lodash'
import { format } from 'date-fns'
import { type MyProfileViewDto } from '../dto/my-profile-view.dto'

export class GetMyProfileQuery {
  constructor(public readonly userId: number) {}
}

@QueryHandler(GetMyProfileQuery)
export class GetMyProfileHandler implements IQueryHandler<GetMyProfileQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: GetMyProfileQuery): Promise<MyProfileViewDto> {
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
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      birthDate: user.profile.birthDate ? format(user.profile.birthDate, 'dd.MM.yyyy') : null,
      city: user.profile.city,
      aboutMe: user.profile.aboutMe,
      lastUpdate: user.profile.updatedAt,
    }
  }
}
