import { type User } from '@prisma/client'

export class RevokeTokenEvent {
  constructor(
    public readonly userId: User['id'],
    public readonly token: string
  ) {}
}
