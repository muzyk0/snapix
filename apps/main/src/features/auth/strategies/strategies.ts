import { LocalStrategy } from './local.strategy'
import { AtJwtStrategy } from './at.jwt.strategy'
import { RtJwtStrategy } from './rt.jwt.strategy'

export const Strategies = [LocalStrategy, AtJwtStrategy, RtJwtStrategy]
