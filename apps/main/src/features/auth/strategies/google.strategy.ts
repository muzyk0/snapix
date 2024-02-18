import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { OAuth2Strategy, type Profile, type VerifyFunction } from 'passport-google-oauth'
import { AppConfigService } from '@app/config'

@Injectable()
export class GoogleStrategy extends PassportStrategy(OAuth2Strategy, 'google') {
  constructor(config: AppConfigService) {
    super({
      clientID: config.googleOAuthConfig.clientID,
      clientSecret: config.googleOAuthConfig.clientSecret,
      callbackURL: config.googleOAuthConfig.callbackURL,
      scope: ['email', 'profile'],
    })
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyFunction
  ) {
    done(null, profile)
  }
}
