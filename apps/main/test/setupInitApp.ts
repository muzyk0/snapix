import { type INestApplication } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'
import { MainModule } from '../src/main.module'
import { NotificationService } from '../src/features/notification/services/notification.service'
import { setupApp } from '../src/setup-app'
import { mockNotificationService } from './common/mocks/mockNotificationService'

export const setupInitApp = async (): Promise<INestApplication> => {
  let app: INestApplication

  // Create a NestJS application
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [MainModule],
  })
    .overrideProvider(NotificationService)
    .useValue(mockNotificationService)
    .compile()

  app = moduleFixture.createNestApplication()

  app = setupApp(app, '')

  await app.init()

  return app
}
