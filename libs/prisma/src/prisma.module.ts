import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { AppConfigModule } from '@app/config'

@Module({
  imports: [AppConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
@Global()
export class PrismaModule {}
