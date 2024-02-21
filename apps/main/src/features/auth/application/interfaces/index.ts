import { type RevokedToken } from '@prisma/client'
import { type RevokeTokenType } from '../../domain/entities/rovokedToken.entity'

export abstract class IRevokedTokensRepository {
  public abstract save: ({ userId, token }: RevokeTokenType) => Promise<void>
  public abstract find: ({ userId, token }: RevokeTokenType) => Promise<RevokedToken | null>
}
