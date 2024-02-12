import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { setupInitApp } from './setupInitApp'

describe('MainController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await setupInitApp()

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!')
  })
})
