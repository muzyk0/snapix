import { type NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export const buildSwaggerDocument = (
  app: NestExpressApplication,
  {
    globalPrefix,
    swaggerVersion,
  }: {
    globalPrefix: string | null
    swaggerVersion: string | null
  }
) => {
  const config = new DocumentBuilder()

  config.setTitle('Snapix project')
  if (swaggerVersion !== null) {
    config.setVersion(swaggerVersion)
  }

  config
    .addTag('auth')
    .addCookieAuth(
      'refreshToken',
      {
        type: 'apiKey',
        in: 'cookie',
        name: 'refreshToken',
        description: 'Refresh token for user',
      },
      'refreshToken'
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Authorization header using the Bearer scheme.',
        in: 'header',
      },
      'accessToken'
    )

  const document = SwaggerModule.createDocument(app, config.build())
  SwaggerModule.setup(
    globalPrefix !== null ? `${globalPrefix}/swagger` : '/swagger',
    app,
    document,
    {
      // customfavIcon: '../../../favicon.ico',
    }
  )
}
