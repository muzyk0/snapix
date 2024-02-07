import { Injectable } from '@nestjs/common'
import { JwtService as NestJwtService } from '@nestjs/jwt'
import { type JwtAtPayload, type JwtRtPayload } from '../../types/jwt.type'
import { type TokensType } from '../../types/tokens.type'
import { AppConfigService } from '@app/config'

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly appConfigService: AppConfigService
  ) {}

  async createJwtTokens(atPayload: JwtAtPayload, rtPayload: JwtRtPayload): Promise<TokensType> {
    const accessToken = await this.jwtService.signAsync(atPayload, {
      secret: this.appConfigService.accessTokenSecret,
      expiresIn: this.appConfigService.accessTokenSecretExpiresIn,
    })

    const refreshToken = await this.jwtService.signAsync(rtPayload, {
      secret: this.appConfigService.refreshTokenSecret,
      expiresIn: this.appConfigService.refreshTokenSecretExpiresIn,
    })
    return {
      accessToken,
      refreshToken,
    }
  }

  async decodeJwtToken<
    T extends {
      iat: Date
      exp: Date
    },
  >(token: string) {
    try {
      const accessToken: T & {
        iat: number
        exp: number
      } = this.jwtService.decode(token)

      const iat = new Date(0)
      iat.setUTCSeconds(accessToken.iat)

      const exp = new Date(0)
      exp.setUTCSeconds(accessToken.exp)

      const newVar = {
        ...accessToken,
        iat,
        exp,
      }
      return newVar
    } catch {
      return null
    }
  }
}
