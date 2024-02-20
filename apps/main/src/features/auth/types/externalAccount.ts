import { type Provider } from 'prisma/prisma-client'

export interface ExternalAccount {
  id: string
  displayName: string
  email: string | undefined
  photo: string | undefined
  provider: Provider
}
