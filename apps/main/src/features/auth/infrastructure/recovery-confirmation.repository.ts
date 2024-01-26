import { PrismaClient, type Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RecoveryConfirmationRepository {
  private readonly prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async createPasswordRecoveryCode(userId: number, code: string, expDate: Date): Promise<boolean> {
    try {
      await this.prisma.passRecovery.upsert({
        where: {
          userId,
        },
        update: {
          code,
          codeExpirationDate: expDate,
        },
        create: {
          userId,
          code,
          codeExpirationDate: expDate,
        },
      })
    } catch (e) {
      console.log(e)
      return false
    }

    return true
  }

  async getInfoByPasswordRecoveryCode(code: string): Promise<any> {
    try {
      return await this.prisma.passRecovery.findUnique({
        where: {
          code,
        },
      })
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
