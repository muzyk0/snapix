import { type CreateSessionType } from '../types/create-session.type'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@app/prisma'

@Injectable()
export class SessionsRepo {
  constructor(private readonly prisma: PrismaService) {}

  async createSessionInfo(sessionDTO: CreateSessionType): Promise<boolean> {
    try {
      await this.prisma.session.create({
        data: {
          ip: sessionDTO.userIp,
          lastActiveDate: sessionDTO.refreshTokenIssuedAt,
          deviceId: sessionDTO.deviceId,
          userId: sessionDTO.userId,
          refreshTokenIssuedAt: sessionDTO.refreshTokenIssuedAt,
        },
      })
    } catch (e) {
      console.log(e)
      return false
    }

    return true
  }
}
