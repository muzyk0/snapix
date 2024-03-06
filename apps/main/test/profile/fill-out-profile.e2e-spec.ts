import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '@app/prisma'
import { setupInitApp } from '../setupInitApp'
import { mockNotificationService } from '../common/mocks/mockNotificationService'
import { correctUser, incorrectUser } from './profile-input-value'
import { clearDbBeforeTest } from '../common/utils/clear-db-before-test'

jest.setTimeout(1000 * 10)

describe('ProfileController (e2e) - fill out', () => {
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

  let refreshToken = ''
  let accessToken = ''
  const badToken = '97603996-b7d5-4a80-a4fb-2b4334131b1d'

  it('should not fill out profile, with bad request input', async () => {
    // register new user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: correctUser.username,
        email: correctUser.email,
        password: correctUser.password,
      })
      .expect(201)

    // get token
    refreshToken = mockNotificationService.sendEmailConfirmationCode.mock.calls[0][0]?.token

    // confirm account
    await request(app.getHttpServer())
      .post('/auth/register/confirm')
      .send({ token: refreshToken })
      .expect(202)
      .then(res => res.body)

    // login user
    const loginUser = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: correctUser.email, password: correctUser.password })
      .expect(200)
    accessToken = loginUser.body.accessToken

    // test profile
    const incorrectResponse = await request(app.getHttpServer())
      .put('/users/profile')
      .auth(accessToken, { type: 'bearer' })
      .send({
        userName: incorrectUser.username,
        firstName: incorrectUser.firstName,
        lastName: incorrectUser.lastName,
        birthDate: incorrectUser.birthDate,
        city: incorrectUser.city,
        aboutMe: incorrectUser.aboutMe,
      })
      .expect(400)

    expect(incorrectResponse.body).toStrictEqual({
      message: 'Validation Exception',
      errors: {
        userName: {
          property: 'userName',
          message: expect.any(String),
          meta: {
            value: incorrectUser.username,
            target: expect.any(Object),
            children: null,
          },
        },
        firstName: {
          property: 'firstName',
          message: expect.any(String),
          meta: {
            value: incorrectUser.firstName,
            target: expect.any(Object),
            children: null,
          },
        },
        lastName: {
          property: 'lastName',
          message: expect.any(String),
          meta: {
            value: incorrectUser.lastName,
            target: expect.any(Object),
            children: null,
          },
        },
        birthDate: {
          property: 'birthDate',
          message: expect.any(String),
          meta: {
            value: incorrectUser.birthDate,
            target: expect.any(Object),
            children: null,
          },
        },
        city: {
          property: 'city',
          message: expect.any(String),
          meta: {
            value: incorrectUser.city,
            target: expect.any(Object),
            children: null,
          },
        },
        aboutMe: {
          property: 'aboutMe',
          message: expect.any(String),
          meta: {
            value: incorrectUser.aboutMe,
            target: expect.any(Object),
            children: null,
          },
        },
      },
    })
  })

  it('should not fill out profile, with incorrect auth', async () => {
    // register new user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: correctUser.username,
        email: correctUser.email,
        password: correctUser.password,
      })
      .expect(201)

    // get token
    refreshToken = mockNotificationService.sendEmailConfirmationCode.mock.calls[0][0]?.token

    // confirm account
    await request(app.getHttpServer())
      .post('/auth/register/confirm')
      .send({ token: refreshToken })
      .expect(202)
      .then(res => res.body)

    // login user
    const loginUser = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: correctUser.email, password: correctUser.password })
      .expect(200)
    accessToken = loginUser.body.accessToken

    // test profile
    await request(app.getHttpServer())
      .put('/users/profile')
      .auth(badToken, {
        type: 'bearer',
      })
      .send({
        userName: correctUser.username,
        firstName: correctUser.userFirstName,
        lastName: correctUser.userLastName,
        birthDate: correctUser.birthDate,
        city: correctUser.city,
        aboutMe: correctUser.aboutMe,
      })
      .expect(401)
  })

  it('should fill out profile', async () => {
    // register new user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: correctUser.username,
        email: correctUser.email,
        password: correctUser.password,
      })
      .expect(201)

    // get token
    refreshToken = mockNotificationService.sendEmailConfirmationCode.mock.calls[0][0]?.token

    // confirm account
    await request(app.getHttpServer())
      .post('/auth/register/confirm')
      .send({ token: refreshToken })
      .expect(202)
      .then(res => res.body)

    // login user
    const loginUser = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: correctUser.email, password: correctUser.password })
      .expect(200)
    accessToken = loginUser.body.accessToken

    // test profile
    await request(app.getHttpServer())
      .put('/users/profile')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        userName: correctUser.username,
        firstName: correctUser.userFirstName,
        lastName: correctUser.userLastName,
        birthDate: correctUser.birthDate,
        city: correctUser.city,
        aboutMe: correctUser.aboutMe,
      })
      .expect(200)
  })

  it('should update not mandatory value profile', async () => {
    // register new user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: correctUser.username,
        email: correctUser.email,
        password: correctUser.password,
      })
      .expect(201)

    // get token
    refreshToken = mockNotificationService.sendEmailConfirmationCode.mock.calls[0][0]?.token

    // confirm account
    await request(app.getHttpServer())
      .post('/auth/register/confirm')
      .send({ token: refreshToken })
      .expect(202)
      .then(res => res.body)

    // login user
    const loginUser = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: correctUser.email, password: correctUser.password })
      .expect(200)
    accessToken = loginUser.body.accessToken

    // test profile
    await request(app.getHttpServer())
      .put('/users/profile')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        userName: correctUser.username,
        firstName: correctUser.userFirstName,
        lastName: correctUser.userLastName,
        city: null,
        birthDate: null,
        aboutMe: null,
      })
      .expect(200)
  })
})
