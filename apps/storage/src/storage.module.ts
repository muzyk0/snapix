import { Module } from '@nestjs/common'
import { FilesModule } from './files/files.module'
import { AppConfigModule } from '@app/config'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.test'],
    }),
    FilesModule,
    AppConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class StorageModule {}
