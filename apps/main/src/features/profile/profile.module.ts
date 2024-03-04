import { Module, type Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { NotificationModule } from '../notification/notification.module';
import { AppConfigModule } from '@app/config';
import { ProfileController } from './controllers/profile.controller';
import { FillOutProfileHandler } from './application/use-cases/fill-out-profile.handler';
import { Strategies } from '../auth/strategies';

const Services: Array<Provider<unknown>> = [JwtService]

@Module({
    imports: [CqrsModule, JwtModule.register({}), NotificationModule, AppConfigModule],
    controllers: [ProfileController],
    providers: [FillOutProfileHandler, ...Services, ...Strategies],
    exports: [...Strategies],
})
export class ProfileModule {}
