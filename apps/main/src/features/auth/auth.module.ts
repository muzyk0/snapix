import { Module, type Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'

import { Strategies } from './strategies'
import { CryptService } from './application/services/crypt.service'
import { AuthController } from './controllers/auth.controller'
import { NotificationModule } from '../notification/notification.module'
import { CommandHandlers } from './application/use-cases'
import { RegisterController } from './controllers/register.controller'
import { UsersModule } from '../users/users.module'
import { SessionsRepo } from './infrastructure/sessions.repository'
import { AppConfigModule } from '@app/config'
import { JwtService } from './application/services/jwt.service'
import { OAuthController } from './controllers/oauth.controller'
import { RevokedTokensRepository } from './infrastructure/revoked-tokens.repository'
import { IRevokedTokensRepository } from './application/interfaces'

const Services: Array<Provider<unknown>> = [CryptService, JwtService]

const Repositories = [
  {
    provide: IRevokedTokensRepository,
    useClass: RevokedTokensRepository,
  },
  SessionsRepo,
]

@Module({
  imports: [CqrsModule, JwtModule.register({}), NotificationModule, UsersModule, AppConfigModule],
  controllers: [AuthController, OAuthController, RegisterController],
  providers: [...Services, ...Strategies, ...CommandHandlers, ...Repositories],
  exports: [...Strategies],
})
export class AuthModule {}
