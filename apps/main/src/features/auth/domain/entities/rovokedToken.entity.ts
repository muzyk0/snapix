import { AggregateRoot } from '@nestjs/cqrs'
import type { RevokedToken, User } from '@prisma/client'
// import { RevokeTokenEvent } from '../events/revoke-token.event'

export interface RevokeTokenType {
  userId: User['id']
  token: string
}

export class RevokedTokenEntity extends AggregateRoot implements Partial<RevokedToken> {
  userId!: number
  token!: string

  constructor(userId: User['id'], token: string) {
    super()

    this.userId = userId
    this.token = token
  }

  static createRevokedToken({ userId, token }: RevokeTokenType): RevokedTokenEntity {
    const revokeToken = new RevokedTokenEntity(userId, token)

    // fixme
    // this.apply(new RevokeTokenEvent(userId, token))

    return revokeToken
  }
}
