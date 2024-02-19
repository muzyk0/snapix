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

const Providers: Array<Provider<unknown>> = [CryptService, SessionsRepo, JwtService]

@Module({
  imports: [CqrsModule, JwtModule.register({}), NotificationModule, UsersModule, AppConfigModule],
  controllers: [AuthController, OAuthController, RegisterController],
  providers: [...Providers, ...Strategies, ...CommandHandlers],
  exports: [...Strategies],
})
export class AuthModule {}
