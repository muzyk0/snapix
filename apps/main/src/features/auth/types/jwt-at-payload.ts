export interface JwtAtPayload {
  user: {
    id: number
    name: string | null
    email: string
  }
}
