import { BadRequestException, type INestApplication, ValidationPipe } from '@nestjs/common'
import { useContainer } from 'class-validator'
import { MainModule } from './main.module'
import cookieParser from 'cookie-parser'

export function setupApp(app: INestApplication, globalPrefix: string | null): INestApplication {
  app.enableCors()
  app.use(cookieParser())

  if (globalPrefix !== null) {
    app.setGlobalPrefix(globalPrefix)
  }

  useContainer(app.select(MainModule), { fallbackOnErrors: true })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,

      stopAtFirstError: true,
      exceptionFactory: options => {
        const errors = options.map(option =>
          Object.values(option.constraints ?? []).map(message => ({
            field: option.property,
            message,
          }))
        )
        return new BadRequestException(errors)
      },
    })
  )

  return app
}
