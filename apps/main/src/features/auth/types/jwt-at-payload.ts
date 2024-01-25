export interface JwtAtPayload {
  user: {
    id: string
    name: string | null
    email: string
  }
}
