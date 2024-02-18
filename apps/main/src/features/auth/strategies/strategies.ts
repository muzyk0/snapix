import { LocalStrategy } from './local.strategy'
import { AtJwtStrategy } from './at.jwt.strategy'
import { RtJwtStrategy } from './rt.jwt.strategy'
import { GoogleStrategy } from './google.strategy'

export const Strategies = [LocalStrategy, AtJwtStrategy, RtJwtStrategy, GoogleStrategy]
