export interface JwtAtPayload {
  user: {
    id: number
    name: string
    email: string
  }
}

export interface DecodedJwtRTPayload extends JwtAtPayload {
  iat: Date
  exp: Date
}
