import { Injectable } from '@nestjs/common'
import { PrismaService } from '@app/prisma'

@Injectable()
export class UsersQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async countRegisteredUsers() {
    return {
      totalCount: await this.prisma.user.count(),
    }
  }
}
