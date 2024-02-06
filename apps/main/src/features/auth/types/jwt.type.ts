export interface JwtAtPayload {
  user: {
    id: number
    name: string
    email: string
  }
}

export interface JwtRtPayload extends JwtAtPayload {
  deviceId: string
}

export interface DecodedJwtRtPayload extends JwtRtPayload {
  iat: Date
  exp: Date
}

export interface JwtPayloadWithRt extends JwtRtPayload {
  refreshToken: string
}
