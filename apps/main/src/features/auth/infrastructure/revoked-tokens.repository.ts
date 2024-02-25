import { Injectable } from '@nestjs/common'
import { PrismaService } from '@app/prisma'
import { type IRevokedTokensRepository } from '../application/interfaces'
import { type RevokedToken } from '@prisma/client'
import { type RevokeTokenType } from '../domain/entities/revokedToken.entity'

@Injectable()
export class RevokedTokensRepository implements IRevokedTokensRepository {
  constructor(private readonly prisma: PrismaService) {}

  // public async revokeToken(entity: RevokeTokenType): Promise<void> {
  //   await this.prisma.revokedToken.upsert({
  //     where: {
  //       userId,
  //       token,
  //     },
  //     create: {
  //       userId,
  //       token,
  //     },
  //     update: {},
  //   })
  // }

  public async save(entity: RevokeTokenType): Promise<void> {
    await this.prisma.revokedToken.create({
      data: entity,
    })
  }

  async find({ userId, token }: RevokeTokenType): Promise<RevokedToken | null> {
    return this.prisma.revokedToken.findUnique({
      where: {
        userId,
        token,
      },
    })
  }
}
