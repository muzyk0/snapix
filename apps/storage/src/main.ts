import { NestFactory } from '@nestjs/core'
import { StorageModule } from './storage.module'
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'
// import * as process from 'process'

// const PORT = Number(process.env.PORT)
// const STORAGE_SERVICE_PORT = Number(process.env.STORAGE_SERVICE_PORT)
// const isDev = process.env.NODE_ENV === 'development'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(StorageModule, {
    transport: Transport.TCP,
    options: {
      // host: isDev ? '127.0.0.1' : '0.0.0.0',
      // port: isDev ? STORAGE_SERVICE_PORT : PORT,
      host: '0.0.0.0',
      port: 3247,
    },
  })

  await app.listen()
}
void bootstrap()
