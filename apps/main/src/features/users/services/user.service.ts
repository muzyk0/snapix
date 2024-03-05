import { Injectable } from '@nestjs/common'
import { PrismaService } from '@app/prisma'
import { randomUUID } from 'crypto'
import { addDays } from 'date-fns'
import { NotificationService } from '../../notification/services/notification.service'

export abstract class IUserService {
  abstract sendConfirmationToken(email: string): Promise<void>
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService
  ) {}

  public async sendConfirmationToken(email: string): Promise<void> {
    const emailConfirmationCode = randomUUID()

    const updatedUser = await this.prisma.user.update({
      where: {
        email,
        emailConfirmed: null,
      },
      data: {
        emailConfirmed: null,
        emailConfirmation: {
          update: {
            token: emailConfirmationCode,
            expiresAt: addDays(new Date(), 1),
          },
        },
        updatedAt: new Date(),
      },
      include: {
        emailConfirmation: true,
      },
    })

    await this.notificationService.sendEmailConfirmationCode({
      email,
      userName: updatedUser.name,
      token: emailConfirmationCode,
    })
  }
}
