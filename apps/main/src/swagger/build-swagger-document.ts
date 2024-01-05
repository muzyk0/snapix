import { type NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export const buildSwaggerDocument = (
  app: NestExpressApplication,
  {
    globalPrefix,
    swaggerVersion,
  }: {
    globalPrefix?: string
    swaggerVersion?: string
  }
) => {
  const config = new DocumentBuilder()

  config
    .setTitle('Blog platform')
    .setDescription(
      "Sorry I'm working on new modules and don't have time to write swagger documentation. But in time it will be completely written"
    )
  if (swaggerVersion !== undefined) {
    config.setVersion(swaggerVersion)
  }

  config.addTag('auth').addBasicAuth()

  const document = SwaggerModule.createDocument(app, config.build())
  SwaggerModule.setup(`${globalPrefix}/swagger`, app, document, {
    // customfavIcon: '../../../favicon.ico',
  })
}
