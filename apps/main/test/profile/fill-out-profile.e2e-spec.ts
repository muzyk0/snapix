import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '@app/prisma'
import { setupInitApp } from '../setupInitApp'
import { correctUser, incorrectUser } from './profile-input-value'
import { clearDbBeforeTest } from '../common/utils/clear-db-before-test'
import { registerConfirmAndLogin } from '../common/utils/authHelper'

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

  let accessToken = ''
  const badToken = '97603996-b7d5-4a80-a4fb-2b4334131b1d'

  it('should not fill out profile, with bad request input', async () => {
    // User register/confirm/login
    accessToken = await registerConfirmAndLogin(app, correctUser)

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
    // User register/confirm/login
    accessToken = await registerConfirmAndLogin(app, correctUser)

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
    // User register/confirm/login
    accessToken = await registerConfirmAndLogin(app, correctUser)

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
    // User register/confirm/login
    accessToken = await registerConfirmAndLogin(app, correctUser)

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

  it('should get profile info', async () => {
    // User register/confirm/login
    accessToken = await registerConfirmAndLogin(app, correctUser)

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

    const getProfile = await request(app.getHttpServer())
      .get('/users/profile')
      .auth(accessToken, {
        type: 'bearer',
      })
      .expect(200)
    expect(getProfile.body).toEqual({
      userName: correctUser.username,
      firstName: correctUser.userFirstName,
      lastName: correctUser.userLastName,
      birthDate: correctUser.birthDate,
      city: correctUser.city,
      aboutMe: correctUser.aboutMe,
      lastUpdate: expect.any(String),
    })
  })
})
