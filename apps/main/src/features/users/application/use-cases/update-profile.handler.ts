import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '@app/prisma'
import { HttpException, HttpStatus } from '@nestjs/common'
import { isNil } from 'lodash'
import { type UpdateProfileDto } from '../../controllers/dto/update-profile.dto'
import { differenceInYears, isBefore } from 'date-fns'

export class UpdateProfileCommand {
  constructor(
    public readonly userId: number,
    public readonly body: UpdateProfileDto
  ) {}
}

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: UpdateProfileCommand) {
    const birthDate = await this.handlerDate(dto.body.birthDate)
    await this.validateAgeIfExists(birthDate)

    await this.prisma.user.update({
      where: {
        id: dto.userId,
      },
      data: {
        name: dto.body.userName,
        profile: {
          update: {
            firstName: dto.body.firstName,
            lastName: dto.body.lastName,
            birthDate,
            city: dto.body.city,
            aboutMe: dto.body.aboutMe,
          },
        },
      },
    })

    return { message: 'Your settings are saved!' }
  }

  async validateAgeIfExists(birthDate: Date | null): Promise<void> {
    if (isNil(birthDate)) return

    const currentDate = new Date()

    const approximateAge = differenceInYears(currentDate, birthDate)
    if (isBefore(currentDate, birthDate) && approximateAge < 13) {
      throw new HttpException(
        'A user under 13 cannot create a profile. Privacy Policy',
        HttpStatus.NOT_ACCEPTABLE
      )
    }
  }

  async handlerDate(birthDate: string | null | undefined): Promise<Date | null> {
    if (isNil(birthDate)) return null

    // date conversion
    const [day, month, year] = birthDate.split('.').map(Number)
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
  }
}
