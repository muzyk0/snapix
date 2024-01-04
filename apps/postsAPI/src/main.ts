import { NestFactory } from '@nestjs/core';
import { PostsApiModule } from './posts-api.module';

async function bootstrap() {
  const app = await NestFactory.create(PostsApiModule);
  await app.listen(3000);
}
bootstrap();
