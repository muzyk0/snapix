import { NestFactory } from '@nestjs/core'
import { PaymentsModule } from './payments.module'

const PORT = 3001

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule)
  await app.listen(PORT)
}
void bootstrap()
