import { BadRequestException, type INestApplication, ValidationPipe } from '@nestjs/common'
import { useContainer } from 'class-validator'
import { MainModule } from './main.module'
import cookieParser from 'cookie-parser'

export class ValidationException extends BadRequestException {}

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
      exceptionFactory: validationErrors => {
        // console.log(validationErrors)
        // const errors2 = validationErrors.flatMap(validationError =>
        //   Object.values(validationError.constraints ?? []).map(message => ({
        //     field: validationError.property,
        //     message,
        //   }))
        // )
        return new ValidationException(validationErrors)
      },
    })
  )

  return app
}

// const data = [
//   {
//     target: {
//       email: 0,
//       password: 0,
//     },
//     property: 'username',
//     children: [],
//     constraints: {
//       isNotEmpty: 'username should not be empty',
//     },
//   },
//   {
//     target: {
//       email: 0,
//       password: 0,
//     },
//     value: 0,
//     property: 'email',
//     children: [],
//     constraints: {
//       isEmail: 'email must be an email',
//     },
//   },
//   {
//     target: {
//       email: 0,
//       password: 0,
//     },
//     value: 0,
//     property: 'password',
//     children: [],
//     constraints: {
//       isLength: 'password must be longer than or equal to 6 characters',
//     },
//   },
// ]
//
// const obj = {
//   username: {
//     property: 'username',
//     message: 'username should not be empty',
//     meta: {
//       value: 0 ?? null,
//       target: {
//         email: 0,
//         password: 0,
//       },
//     },
//   },
// }
//
// const data2 = [
//   {
//     field: 'username',
//     message: 'username should not be empty',
//   },
//   {
//     field: 'email',
//     message: 'email must be an email',
//   },
//   {
//     field: 'password',
//     message: 'password must be longer than or equal to 6 characters',
//   },
// ]
