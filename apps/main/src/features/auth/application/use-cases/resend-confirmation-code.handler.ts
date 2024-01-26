import { BadRequestException } from '@nestjs/common'
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { addDays } from 'date-fns'
import { EmailService } from '../../../../../../notifier/src/email/email.service'
import { PrismaService } from '@app/prisma'
import { randomUUID } from 'crypto'

export class ResendConfirmationCodeCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(ResendConfirmationCodeCommand)
export class ResendConfirmationCodeHandler
  implements ICommandHandler<ResendConfirmationCodeCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService
  ) {}

  async execute({ email }: ResendConfirmationCodeCommand): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (user === null) {
      throw new BadRequestException([{ message: "Email isn't exist", field: 'email' }])
    }

    if (user.emailConfirmed !== null) {
      throw new BadRequestException([{ message: 'Email already confirm', field: 'email' }])
    }

    const emailConfirmationToken = randomUUID()

    const updatedUser = await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        emailConfirmation: {
          update: {
            token: emailConfirmationToken,
            expiresIn: addDays(new Date(), 1),
          },
        },
      },
      include: {
        emailConfirmation: true,
      },
    })

    await this.emailService.sendConfirmEmail({
      email,
      userName: updatedUser.name,
      confirmationCode: emailConfirmationToken,
    })
    return true
  }
}
