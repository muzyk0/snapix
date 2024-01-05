import { NestFactory } from '@nestjs/core'
import { StorageModule } from './storage.module'

const PORT = 3001

async function bootstrap() {
  const app = await NestFactory.create(StorageModule)

  await app.listen(PORT)
}
void bootstrap()
