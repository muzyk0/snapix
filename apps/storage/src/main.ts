import { NestFactory } from '@nestjs/core'
import { StorageModule } from './storage.module'
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'

const PORT = 3001

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(StorageModule, {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: PORT,
    },
  })

  await app.listen()
}
void bootstrap()
