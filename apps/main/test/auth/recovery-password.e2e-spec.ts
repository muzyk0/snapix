import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '@app/prisma'
import { setupInitApp } from '../setupInitApp'
import { mockNotificationService } from '../common/mocks/mockNotificationService'
import { clearDbBeforeTest } from '../common/utils/clear-db-before-test'

jest.setTimeout(1000 * 20)

describe('AuthController (e2e) - recovery password', () => {
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

  it('should send recovery token for change password', async () => {
    const username = 'testuser3'
    const email = 'testuser3-1@example.com'
    const password = 'password0aA!='

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, email, password })
      .expect(201)

    expect(mockNotificationService.sendEmailConfirmationCode).toHaveBeenCalledTimes(1)

    const mockCalledConfirmationToken =
      mockNotificationService.sendEmailConfirmationCode.mock.calls[0][0]?.confirmationCode

    expect(mockCalledConfirmationToken).not.toBeUndefined()

    await request(app.getHttpServer())
      .post('/auth/register/confirm')
      .send({ token: mockCalledConfirmationToken })
      .expect(202)
      .then(res => res.body)

    await request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({ email })
      .expect(202)
      .then(res => res.body)

    expect(mockNotificationService.sendEmailConfirmationCode).toHaveBeenCalledTimes(1)
    expect(mockNotificationService.sendRecoveryPasswordTempCode).toHaveBeenCalledTimes(1)

    const mockCalledRecoveryCode =
      mockNotificationService.sendRecoveryPasswordTempCode.mock.calls[0][0]?.recoveryCode

    expect(mockCalledRecoveryCode).not.toBeUndefined()

    await request(app.getHttpServer())
      .post('/auth/new-password')
      .send({ token: mockCalledRecoveryCode, password: `${password}_new` })
      .expect(204)
      .then(res => res.body)

    await request(app.getHttpServer())
      .post('/auth/new-password')
      .send({ token: mockCalledRecoveryCode, password: `${password}_new` })
      .expect(400)
      .then(res => res.body)

    // todo: login
  })

  it('should get error if email does not exist', async () => {
    const email = 'testuser3-1@example.com'

    const response = await request(app.getHttpServer())
      .post('/auth/forgot-password')
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

    expect(mockNotificationService.sendRecoveryPasswordTempCode).toHaveBeenCalledTimes(0)

    const mockCalledRecoveryCode =
      mockNotificationService.sendRecoveryPasswordTempCode.mock.calls[0]?.[0]?.recoveryCode

    expect(mockCalledRecoveryCode).toBeUndefined()
  })

  it('should send confirmation token if user does not confirmed and send recovery token after confirm account', async () => {
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
      .post('/auth/forgot-password')
      .send({ email })
      .expect(202)
      .then(res => res.body)

    expect(mockNotificationService.sendEmailConfirmationCode).toHaveBeenCalledTimes(2)
    expect(mockNotificationService.sendRecoveryPasswordTempCode).toHaveBeenCalledTimes(0)

    const mockCalledConfirmationToken2 =
      mockNotificationService.sendEmailConfirmationCode.mock.calls[1][0]?.confirmationCode

    await request(app.getHttpServer())
      .post('/auth/register/confirm')
      .send({ token: mockCalledConfirmationToken1 })
      .expect(400)

    await request(app.getHttpServer())
      .post('/auth/register/confirm')
      .send({ token: mockCalledConfirmationToken2 })
      .expect(202)

    await request(app.getHttpServer()).post('/auth/forgot-password').send({ email }).expect(202)
  })

  it('should receive error if token is not valid for set new password', async () => {
    const password = 'password0aA!='

    const response = await request(app.getHttpServer())
      .post('/auth/new-password')
      .send({ token: 'a07cf4da-7a1f-4fb5-9768-db9cdaedd7b3', password: `${password}_new` })
      .expect(400)
      .then(res => res.body)

    expect(response).toStrictEqual({
      message: 'Bad Request Exception',
      errors: {
        token: {
          message: 'Invalid token',
          property: 'token',
        },
      },
      timestamp: expect.any(String),
      path: expect.any(String),
    })
  })
})
