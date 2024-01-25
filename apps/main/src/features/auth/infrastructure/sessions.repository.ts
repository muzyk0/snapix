import { PrismaClient } from '@prisma/client'
import { type createSessionDTO } from '../types/create-session-dto-type'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SessionsRepo {
  private readonly prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async createSessionInfo(sessionDTO: createSessionDTO): Promise<boolean> {
    try {
      await this.prisma.session.create({
        data: {
          ip: sessionDTO.loginIp,
          lastActiveDate: new Date(),
          deviceId: sessionDTO.deviceId,
          userId: sessionDTO.userId,
          RFTokenIAT: new Date(sessionDTO.refreshTokenIssuedAt),
        },
      })
    } catch (e) {
      console.log(e)
      return false
    }

    return true
  }
}
