import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '@app/prisma'
import { NotFoundException } from '@nestjs/common'

export class GetProfileInfoCommand {
  constructor(public readonly userId: number) {}
}

@CommandHandler(GetProfileInfoCommand)
export class GetProfileInfoHandler implements ICommandHandler<GetProfileInfoCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: GetProfileInfoCommand) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: dto.userId,
      },
    })
    if (!user) throw new NotFoundException('No user')

    const profile = await this.prisma.profile.findUnique({
      where: {
        id: user.profileId!,
      },
    })
    if (!profile) throw new NotFoundException('No profile')

    let birthDate: string | null = null
    if (profile.birthDate) {
      birthDate = profile.birthDate.toLocaleDateString()
    }

    return {
      userName: user.name,
      firstName: profile.firstName,
      lastName: profile.lastName,
      birthDate,
      city: profile.city,
      aboutMe: profile.aboutMe,
      lastUpdate: profile.updatedAt,
    }
  }
}
