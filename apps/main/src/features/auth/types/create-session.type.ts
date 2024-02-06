export interface CreateSessionType {
  userIp?: string
  refreshTokenIssuedAt: Date
  refreshTokenExpireAt: Date
  userId: number
  deviceId: string
}
