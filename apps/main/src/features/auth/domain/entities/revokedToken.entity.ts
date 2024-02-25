import { AggregateRoot } from '@nestjs/cqrs'
import type { RevokedToken, User } from '@prisma/client'

export interface RevokeTokenType {
  userId: User['id']
  token: string
}

export class RevokedTokenEntity extends AggregateRoot implements Partial<RevokedToken> {
  userId!: number
  token!: string

  constructor({ userId, token }: RevokeTokenType) {
    super()

    this.userId = userId
    this.token = token
  }

  static createRevokedToken({ userId, token }: RevokeTokenType): RevokedTokenEntity {
    return new RevokedTokenEntity({ userId, token })
  }
}
