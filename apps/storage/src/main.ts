import { NestFactory } from '@nestjs/core'
import { StorageModule } from './storage.module'
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(StorageModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.STORAGE_SERVICE_HOST ?? '0.0.0.0',
      port: Number(process.env.STORAGE_SERVICE_PORT) || 3247,
    },
  })

  console.log(process.env.STORAGE_SERVICE_PORT)
  await app.listen()
}

void bootstrap()
