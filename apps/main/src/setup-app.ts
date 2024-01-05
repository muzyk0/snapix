import { BadRequestException, type INestApplication, ValidationPipe } from '@nestjs/common'
import { useContainer } from 'class-validator'
import { MainModule } from './main.module'

export function setupApp(app: INestApplication, globalPrefix: string | null): INestApplication {
  app.enableCors()

  if (globalPrefix !== null) {
    app.setGlobalPrefix(globalPrefix)
  }

  useContainer(app.select(MainModule), { fallbackOnErrors: true })
  app.useGlobalPipes(
    new ValidationPipe({
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
  // app.useGlobalFilters(new ErrorExceptionFilter(), new HttpExceptionFilter())

  return app
}
