export interface JwtAtPayload {
  user: {
    id: string
    login: string
    email: string
  }
}
