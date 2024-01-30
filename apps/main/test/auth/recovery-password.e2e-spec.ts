import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '@app/prisma'
import { setupInitApp } from '../setupInitApp'
import { mockNotificationService } from '../common/mocks/mockNotificationService'

jest.setTimeout(1000 * 60)

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
    await prisma.passwordRecovery.deleteMany()
    await prisma.user.deleteMany()
    await prisma.confirmations.deleteMany()
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
      .post('/auth/password-recovery')
      .send({ email })
      .expect(202)
      .then(res => res.body)

    expect(mockNotificationService.sendEmailConfirmationCode).toHaveBeenCalledTimes(1)
    expect(mockNotificationService.sendRecoveryPasswordTempCode).toHaveBeenCalledTimes(1)

    const mockCalledRecoveryCode =
      mockNotificationService.sendRecoveryPasswordTempCode.mock.calls[0][0]?.recoveryCode

    expect(mockCalledRecoveryCode).not.toBeUndefined()

    // todo: change user password
  })

  it('should get error if email does not exist', async () => {
    const email = 'testuser3-1@example.com'

    const response = await request(app.getHttpServer())
      .post('/auth/password-recovery')
      .send({ email })
      .expect(400)
      .then(res => res.body)

    expect(response).toStrictEqual({
      message: 'Bad Request Exception',
      errors: {
        email: {
          message: "User with this email doesn't exist",
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
})
