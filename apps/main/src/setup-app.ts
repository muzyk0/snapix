import { BadRequestException, type INestApplication, ValidationPipe } from '@nestjs/common'
import { useContainer } from 'class-validator'
import { MainModule } from './main.module'
import cookieParser from 'cookie-parser'

export class ValidationException extends BadRequestException {}

export function setupApp(app: INestApplication, globalPrefix: string | null): INestApplication {
  app.use(cookieParser())
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3002',
      'https://9art.ru',
    ],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: ['Accept', 'Content-Type', 'Authorization'],
  })

  if (globalPrefix !== null) {
    app.setGlobalPrefix(globalPrefix)
  }

  useContainer(app.select(MainModule), { fallbackOnErrors: true })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,

      stopAtFirstError: true,
      exceptionFactory: validationErrors => {
        return new ValidationException(validationErrors)
      },
    })
  )

  return app
}
