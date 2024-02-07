import { ForbiddenException, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { type Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AppConfigService } from '@app/config'
import { isNil } from 'lodash'
import { type JwtPayloadWithRt, type JwtRtPayload } from '../types/jwt.type'

@Injectable()
export class RtJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(readonly config: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req?.cookies.refreshToken
          if (isNil(token)) {
            return null
          }
          return token
        },
      ]),
      secretOrKey: config.refreshTokenSecret,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: JwtRtPayload): Promise<JwtPayloadWithRt> {
    const refreshToken = req?.cookies.refreshToken

    if (isNil(refreshToken)) {
      throw new ForbiddenException('Refresh token malformed')
    }

    return { ...payload, refreshToken }
  }
}
