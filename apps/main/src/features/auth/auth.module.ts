import { Module, type Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule, JwtService } from '@nestjs/jwt'

import { Strategies } from './strategies'
import { CryptService } from './application/services/crypt.service'
import { AuthController } from './controllers/auth.controller'
import { NotificationModule } from '../notification/notification.module'
import { CommandHandlers } from './application/use-cases'
import { RegisterController } from './controllers/register.controller'
import { SessionsRepo } from './infrastructure/sessions.repository'
import { AppConfigModule } from '@app/config'

const Providers: Array<Provider<unknown>> = [CryptService, JwtService, SessionsRepo]

@Module({
  imports: [CqrsModule, JwtModule.register({}), NotificationModule, AppConfigModule],
  controllers: [AuthController, RegisterController],
  providers: [...Providers, ...Strategies, ...CommandHandlers],
  exports: [...Strategies],
})
export class AuthModule {}
