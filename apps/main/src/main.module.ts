import { Module } from '@nestjs/common'
import { MainController } from './main.controller'
import { MainService } from './main.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [MainController],
  providers: [MainService],
})
export class MainModule {}
