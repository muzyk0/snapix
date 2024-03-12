import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '@app/prisma'
import { setupInitApp } from '../setupInitApp'
import { clearDbBeforeTest } from '../common/utils/clear-db-before-test'
import { registerConfirmAndLogin } from '../common/utils/authHelper'
import { correctUser } from '../profile/profile-input-value'

jest.setTimeout(1000 * 10)

describe('PostController (e2e) - fill out', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    app = await setupInitApp()

    prisma = app.get(PrismaService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await clearDbBeforeTest(prisma)
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  // removed
  // const badToken = '97603996-b7d5-4a80-a4fb-2b4334131b1d'

  it('should not create post, with bad request input', async () => {
    // User register/confirm/login
    const accessToken = await registerConfirmAndLogin(app, correctUser)

    // test post
    await request(app.getHttpServer())
      .post('/posts')
      .auth(accessToken, { type: 'bearer' })
      .send({
        content: true,
        photoId: false,
      })
      .expect(400)
  })

  it('should not create post, with incorrect auth', async () => {
    // add
    const badToken = '97603996-b7d5-4a80-a4fb-2b4334131b1d'

    // test posts
    await request(app.getHttpServer())
      .post('/posts')
      .auth(badToken, {
        type: 'bearer',
      })
      .send({
        content: 'Good day!',
        photoId: 'correctId',
      })
      .expect(401)
  })

  it('should create new post', async () => {
    // User register/confirm/login
    const accessToken = await registerConfirmAndLogin(app, correctUser)

    // test posts
    await request(app.getHttpServer())
      .post('/posts')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        content: 'Good day!',
        photoId: 'correctId',
      })
      .expect(201)
  })

  it('should create post without content', async () => {
    // User register/confirm/login
    const accessToken = await registerConfirmAndLogin(app, correctUser)

    // test post
    await request(app.getHttpServer())
      .post('/posts')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        photoId: 'correctId_2',
      })
      .expect(201)
  })

  // todo: need to add in test correct upload photo
  it.skip('should get content without content', async () => {
    // User register/confirm/login
    const accessToken = await registerConfirmAndLogin(app, correctUser)

    // test post
    const postResponse = await request(app.getHttpServer())
      .post('/posts')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        photoId: 'correctId_2',
      })
      .expect(201)

    const getResponse = await request(app.getHttpServer())
      .get(`/posts/${postResponse.body.postId}`)
      .auth(accessToken, {
        type: 'bearer',
      })
      .expect(200)
    expect(getResponse.body.content).toBe(null)
  })

  it('should update content', async () => {
    // User register/confirm/login
    const accessToken = await registerConfirmAndLogin(app, correctUser)

    // test post
    const postResponse = await request(app.getHttpServer())
      .post('/posts')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        photoId: 'correctId_2',
      })
      .expect(201)

    await request(app.getHttpServer())
      .put(`/posts/${postResponse.body.postId}`)
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({ content: 'Update description!' })
      .expect(200)
  })

  it('should not update content if incorrect postId', async () => {
    // User register/confirm/login
    const accessToken = await registerConfirmAndLogin(app, correctUser)

    // test post
    await request(app.getHttpServer())
      .post('/posts')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        photoId: 'correctId_2',
      })
      .expect(201)

    await request(app.getHttpServer())
      .put('/posts/0')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({ content: 'Update description!' })
      .expect(404)
  })
})
