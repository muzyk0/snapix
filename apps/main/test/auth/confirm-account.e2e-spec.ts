import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '@app/prisma'
import { setupInitApp } from '../setupInitApp'
import { mockNotificationService } from '../common/mocks/mockNotificationService'
import { CONFIRMATION_STATUS } from '../../src/features/auth/types/confirm-status.enum'
import { addDays } from 'date-fns'
import { clearDbBeforeTest } from '../common/utils/clear-db-before-test'

jest.setTimeout(1000 * 20)

describe('AuthController (e2e) - confirm account', () => {
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

  it('should confirm user account', async () => {
    const username = 'testuser3'
    const email = 'testuser3-1@example.com'
    const password = 'password0aA!='

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

    const mockCalledConfirmationToken =
      mockNotificationService.sendEmailConfirmationCode.mock.calls[0][0]?.token

    const badToken = '97603996-b7d5-4a80-a4fb-2b4334131b1d'

    const badTokenResponse = await request(app.getHttpServer())
      .post('/auth/register/confirm')
      .send({ token: badToken })
      .expect(400)
      .then(res => res.body)

    expect(badTokenResponse).toStrictEqual({
      message: 'Bad Request Exception',
      errors: {
        token: {
          message: CONFIRMATION_STATUS.BAD_TOKEN,
          property: 'token',
        },
      },
      timestamp: expect.any(String),
      path: expect.any(String),
    })

    const acceptedResponse = await request(app.getHttpServer())
      .post('/auth/register/confirm')
      .send({ token: mockCalledConfirmationToken })
      .expect(202)
      .then(res => res.body)

    expect(acceptedResponse).toStrictEqual({
      status: CONFIRMATION_STATUS.OK,
      message: 'OK',
    })

    const confirmedBeforeResponse = await request(app.getHttpServer())
      .post('/auth/register/confirm')
      .send({ token: mockCalledConfirmationToken })
      .expect(400)
      .then(res => res.body)

    expect(confirmedBeforeResponse).toStrictEqual({
      message: 'Bad Request Exception',
      errors: {
        token: {
          message: CONFIRMATION_STATUS.CONFIRMED,
          property: 'token',
        },
      },
      timestamp: expect.any(String),
      path: expect.any(String),
    })
  })

  it('should expired token for confirm register', async () => {
    const username = 'testuser3'
    const email = 'testuser3-1@example.com'
    const password = 'password0aA!='

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

    const mockCalledConfirmationToken =
      mockNotificationService.sendEmailConfirmationCode.mock.calls[0][0]?.token

    jest.useFakeTimers().setSystemTime(addDays(new Date(), 2))

    const expiredTokenResponse = await request(app.getHttpServer())
      .post('/auth/register/confirm')
      .send({ token: mockCalledConfirmationToken })
      .expect(400)
      .then(res => res.body)

    expect(expiredTokenResponse).toStrictEqual({
      message: 'Bad Request Exception',
      errors: {
        token: {
          message: CONFIRMATION_STATUS.EXPIRED,
          property: 'token',
        },
      },
      timestamp: expect.any(String),
      path: expect.any(String),
    })
  })
})
