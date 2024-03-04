import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '@app/prisma'
import { setupInitApp } from '../setupInitApp'
import { mockNotificationService } from '../common/mocks/mockNotificationService'
import { clearDbBeforeTest } from '../common/utils/clear-db-before-test'
import { CONFIRMATION_STATUS } from '../../src/features/auth/types/confirm-status.enum'
import {
  aboutMe,
  birthDate,
  city,
  email,
  incAboutMe,
  incBirthDate,
  incCity,
  incUserFirstName,
  incUserLastName,
  incUserName,
  password,
  userFirstName,
  userLastName,
  username,
} from './profile-input-value'

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
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  let correctToken = ''
  const badToken = '97603996-b7d5-4a80-a4fb-2b4334131b1d'

  it('register and confirm user, before other test', async () => {
    // clear db
    await clearDbBeforeTest(prisma)

    // register new user

    const response1 = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, email, password })
      .expect(201)

    expect(response1.body.message).toBe(
      `You are registered. We have sent a link to confirm your email address to ${email}`
    )

    expect(mockNotificationService.sendEmailConfirmationCode).toHaveBeenCalledWith({
      email,
      userName: username,
      token: expect.any(String),
    })

    // get token
    correctToken = mockNotificationService.sendEmailConfirmationCode.mock.calls[0][0]?.token

    // confirm account
    const acceptedResponse = await request(app.getHttpServer())
      .post('/auth/register/confirm')
      .send({ token: correctToken })
      .expect(202)
      .then(res => res.body)

    expect(acceptedResponse).toStrictEqual({
      status: CONFIRMATION_STATUS.OK,
      message: 'OK',
    })
  })

  it('should not fill out profile, with bad request input', async () => {
    const incorrectResponse = await request(app.getHttpServer())
      .post('/profile/fill-out')
      .send({
        userName: incUserName,
        firstName: incUserFirstName,
        lastName: incUserLastName,
        birthDate: incBirthDate,
        city: incCity,
        aboutMe: incAboutMe,
      })
      .expect(400)

    expect(incorrectResponse.body.message).toBe({
      message: 'Validation Exception',
      errors: {
        userName: {
          property: 'userName',
          message: expect.any(String),
          meta: expect.any(Object),
        },
        firstName: {
          property: 'firstName',
          message: expect.any(String),
          meta: expect.any(Object),
        },
        lastName: {
          property: 'lastName',
          message: expect.any(String),
          meta: expect.any(Object),
        },
        birthDate: {
          property: 'birthDate',
          message: expect.any(String),
          meta: expect.any(Object),
        },
        city: {
          property: 'city',
          message: expect.any(String),
          meta: expect.any(Object),
        },
        aboutMe: {
          property: 'aboutMe',
          message: expect.any(String),
          meta: expect.any(Object),
        },
      },
    })
  })

  it('should not fill out profile, with incorrect auth', async () => {
    await request(app.getHttpServer())
      .post('/profile/fill-out')
      .auth(badToken, {
        type: 'bearer',
      })
      .send({
        userName: username,
        firstName: userFirstName,
        lastName: userLastName,
        birthDate,
        city,
        aboutMe,
      })
      .expect(401)
  })

  it('should fill out profile', async () => {
    await request(app.getHttpServer())
      .post('/profile/fill-out')
      .auth(correctToken, {
        type: 'bearer',
      })
      .send({
        userName: username,
        firstName: userFirstName,
        lastName: userLastName,
        birthDate,
        city,
        aboutMe,
      })
      .expect(201)
  })
})
