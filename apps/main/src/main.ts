import { NestFactory } from '@nestjs/core'
import { MainModule } from './main.module'

const PORT = 3000

async function bootstrap() {
  const app = await NestFactory.create(MainModule)
  await app.listen(PORT)
}
void bootstrap()
