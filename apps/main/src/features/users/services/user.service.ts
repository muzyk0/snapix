import { Injectable } from '@nestjs/common'
import { PrismaService } from '@app/prisma'
import { randomUUID } from 'crypto'
import { addDays } from 'date-fns'
import { NotificationService } from '../../notification/services/notification.service'

@Injectable()
export class UserService {
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
      confirmationCode: emailConfirmationCode,
    })
  }
}
