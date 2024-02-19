export interface ExternalAccount {
  id: string
  displayName: string
  email: string | undefined
  photo: string | undefined
  provider: string
}
