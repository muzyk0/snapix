import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '@app/prisma'
import { BadRequestException } from '@nestjs/common'
import { isNil } from 'lodash'
import { format } from 'date-fns'

export class GetProfileCommand {
  constructor(public readonly userId: number) {}
}

@CommandHandler(GetProfileCommand)
export class GetProfileHandler implements ICommandHandler<GetProfileCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: GetProfileCommand) {
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
