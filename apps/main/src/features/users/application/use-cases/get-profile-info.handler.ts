import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '@app/prisma'
import { NotFoundException } from '@nestjs/common'
import { isNil } from 'lodash'

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
    if (isNil(user)) throw new NotFoundException('No user')

    const profile = await this.prisma.profile.findUnique({
      where: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        id: user.profileId!,
      },
    })
    if (isNil(profile)) throw new NotFoundException('No profile')

    const birthDate = await this.handlerDate(profile.birthDate)

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

  async handlerDate(birthDate: Date | null): Promise<string | null> {
    if (isNil(birthDate)) return null

    const day = birthDate.getDate().toString().padStart(2, '0')
    const month = (birthDate.getMonth() + 1).toString().padStart(2, '0')
    const year = birthDate.getFullYear()

    return `${day}.${month}.${year}`
  }
}
