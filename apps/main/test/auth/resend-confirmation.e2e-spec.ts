import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '@app/prisma'
import { setupInitApp } from '../setupInitApp'
import { mockNotificationService } from '../common/mocks/mockNotificationService'
import { CONFIRMATION_STATUS } from '../../src/features/auth/types/confirm-status.enum'
import { clearDbBeforeTest } from '../common/utils/clear-db-before-test'

jest.setTimeout(1000 * 60)

describe('AuthController (e2e) - resend confirmation token', () => {
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

  it('should resend confirmation', async () => {
    const username = 'testuser3'
    const email = 'testuser3-1@example.com'
    const password = 'password0aA!='

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, email, password })
      .expect(201)

    expect(mockNotificationService.sendEmailConfirmationCode).toHaveBeenCalledTimes(1)

    const mockCalledConfirmationToken1 =
      mockNotificationService.sendEmailConfirmationCode.mock.calls[0][0]?.confirmationCode

    expect(mockCalledConfirmationToken1).not.toBeUndefined()

    await request(app.getHttpServer())
      .post('/auth/register/resend-confirmation-token')
      .send({ email })
      .expect(202)
      .then(res => res.body)

    expect(mockNotificationService.sendEmailConfirmationCode).toHaveBeenCalledTimes(2)

    const mockCalledConfirmationToken2 =
      mockNotificationService.sendEmailConfirmationCode.mock.calls[1][0]?.confirmationCode

    expect(mockCalledConfirmationToken2).not.toBeUndefined()

    const badTokenResponse = await request(app.getHttpServer())
      .post('/auth/register/confirm')
      .send({ token: mockCalledConfirmationToken1 })
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

    await request(app.getHttpServer())
      .post('/auth/register/confirm')
      .send({ token: mockCalledConfirmationToken2 })
      .expect(202)
      .then(res => res.body)
  })

  it('should received error if email not found', async () => {
    const email = 'testuser3-1@example.com'
    const response = await request(app.getHttpServer())
      .post('/auth/register/resend-confirmation-token')
      .send({ email })
      .expect(400)
      .then(res => res.body)

    expect(response).toStrictEqual({
      message: 'Bad Request Exception',
      errors: {
        email: {
          message: "UserService with this email doesn't exist",
          property: 'email',
        },
      },
      timestamp: expect.any(String),
      path: expect.any(String),
    })

    expect(mockNotificationService.sendEmailConfirmationCode).toHaveBeenCalledTimes(0)

    const mockCalledConfirmationToken =
      mockNotificationService.sendEmailConfirmationCode.mock.calls[0]?.[0]?.confirmationCode

    expect(mockCalledConfirmationToken).toBeUndefined()
  })

  it('should received error if email already confirmed', async () => {
    const username = 'testuser3'
    const email = 'testuser3-1@example.com'
    const password = 'password0aA!='

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, email, password })
      .expect(201)

    expect(mockNotificationService.sendEmailConfirmationCode).toHaveBeenCalledTimes(1)

    const mockCalledConfirmationToken1 =
      mockNotificationService.sendEmailConfirmationCode.mock.calls[0][0]?.confirmationCode

    expect(mockCalledConfirmationToken1).not.toBeUndefined()

    await request(app.getHttpServer())
      .post('/auth/register/confirm')
      .send({ token: mockCalledConfirmationToken1 })
      .expect(202)
      .then(res => res.body)

    const response = await request(app.getHttpServer())
      .post('/auth/register/resend-confirmation-token')
      .send({ email })
      .expect(400)
      .then(res => res.body)

    expect(response).toStrictEqual({
      message: 'Bad Request Exception',
      errors: {
        email: {
          message: 'UserService with this email already confirmed',
          property: 'email',
        },
      },
      timestamp: expect.any(String),
      path: expect.any(String),
    })
  })
})
