import { type CreateSessionType } from '../types/create-session.type'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@app/prisma'
import * as console from 'console'

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
          deviceName: sessionDTO.deviceName,
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

  async upsertSessionInfo(sessionDTO: CreateSessionType): Promise<boolean> {
    try {
      await this.prisma.session.upsert({
        where: {
          userId_deviceId: {
            userId: sessionDTO.userId,
            deviceId: sessionDTO.deviceId,
          },
        },
        update: {
          ip: sessionDTO.userIp,
          lastActiveDate: sessionDTO.refreshTokenIssuedAt,
          deviceId: sessionDTO.deviceId,
          deviceName: sessionDTO.deviceName,
          refreshTokenIssuedAt: sessionDTO.refreshTokenIssuedAt,
        },
        create: {
          ip: sessionDTO.userIp,
          lastActiveDate: sessionDTO.refreshTokenIssuedAt,
          deviceId: sessionDTO.deviceId,
          deviceName: sessionDTO.deviceName,
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
