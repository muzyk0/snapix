import { Module, type Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule, JwtService } from '@nestjs/jwt'

import { Strategies } from './strategies'
import { CryptService } from './application/services/crypt.service'
import { AuthController } from './controllers/auth.controller'
import { NotificationModule } from '../notification/notification.module'
import { CommandHandlers } from './application/use-cases'
import { RegisterController } from './controllers/register.controller'

const Providers: Array<Provider<any>> = [CryptService, JwtService]

@Module({
  imports: [CqrsModule, JwtModule.register({}), NotificationModule],
  controllers: [AuthController, RegisterController],
  providers: [...Providers, ...Strategies, ...CommandHandlers],
  exports: [...Strategies],
})
export class AuthModule {}
