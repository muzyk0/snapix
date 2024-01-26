import { type CreateSessionDTO } from '../types/create-session-dto-type'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@app/prisma'

@Injectable()
export class SessionsRepo {
  constructor(private readonly prisma: PrismaService) {}

  async createSessionInfo(sessionDTO: CreateSessionDTO): Promise<boolean> {
    try {
      await this.prisma.session.create({
        data: {
          ip: sessionDTO.loginIp,
          lastActiveDate: new Date(),
          deviceId: sessionDTO.deviceId,
          userId: sessionDTO.userId,
          refreshTokenIssuedAt: new Date(sessionDTO.refreshTokenIssuedAt),
        },
      })
    } catch (e) {
      console.log(e)
      return false
    }

    return true
  }
}
