import { Module } from '@nestjs/common'
import { FilesModule } from './files/files.module'
import { AppConfigModule, AppConfigService } from '@app/config'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { HealthModule } from '@app/core/health/health.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.test'],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: AppConfigService) => ({
        uri: configService.mongoDbOptions.uri,
      }),
      inject: [AppConfigService],
    }),
    AppConfigModule,
    HealthModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class StorageModule {}
