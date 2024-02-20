import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { OAuth2Strategy, type Profile, type VerifyFunction } from 'passport-google-oauth'
import { AppConfigService } from '@app/config'
import { type ExternalAccount } from '../types/externalAccount'
import { type Provider } from 'prisma/prisma-client'

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
    const account: ExternalAccount = {
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails?.[0].value,
      photo: profile.photos?.[0].value,
      provider: profile.provider as Provider,
    }
    done(null, account)
  }
}
