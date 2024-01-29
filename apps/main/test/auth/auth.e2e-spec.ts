import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '@app/prisma'
import { setupInitApp } from '../setupInitApp'
import { mockNotificationService } from '../common/mocks/mockNotificationService'
import { CONFIRMATION_STATUS } from '../../src/features/auth/types/confirm-status.enum'
import { addDays } from 'date-fns'

jest.setTimeout(1000 * 60)

describe('AuthController (e2e)', () => {
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
    await prisma.user.deleteMany()
    await prisma.confirmations.deleteMany()
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should be defined prisma service', () => {
    expect(prisma).toBeDefined()
  })

  it('should register a new user and send a confirmation email', async () => {
    const username = 'testuser'
    const email = 'testuser@example.com'
    const password = 'password0aA!='

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, email, password })
      .expect(201)

    expect(response.body.message).toBe(`We have sent a link to confirm your email to ${email}`)

    expect(mockNotificationService.sendEmailConfirmationCode).toHaveBeenCalledWith({
      email,
      userName: username,
      confirmationCode: expect.any(String),
    })
  })

  it('should not register a user with an existing email', async () => {
    const username = 'testuser2-1'
    const username2 = 'testuser2-2'
    const email = 'testuser2@example.com'
    const password = 'password0aA!='

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, email, password })
      .expect(201)

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: username2, email, password })
      .expect(400)

    expect(response.body.message).toBe('User with this email is already registered')
  })

  it('should not register a user with an existing username', async () => {
    const username = 'testuser3'
    const email = 'testuser3-1@example.com'
    const email2 = 'testuser3-2@example.com'
    const password = 'password0aA!='

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, email, password })
      .expect(201)

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, email: email2, password })
      .expect(400)

    expect(response.body.message).toBe('User with this username is already registered')
  })

  it('should resend confirmation token if do not confirm email and sign up now', async () => {
    const username = 'testuser3'
    const email = 'testuser3-1@example.com'
    const password = 'password0aA!='

    const response1 = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, email, password })
      .expect(201)

    expect(response1.body.message).toBe(`We have sent a link to confirm your email to ${email}`)

    expect(mockNotificationService.sendEmailConfirmationCode).toHaveBeenCalledWith({
      email,
      userName: username,
      confirmationCode: expect.any(String),
    })

    const mockCalledConfirmationCode1 =
      mockNotificationService.sendEmailConfirmationCode.mock.calls[0][0]?.confirmationCode

    mockNotificationService.sendEmailConfirmationCode.mockClear()

    const response2 = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, email, password })
      .expect(201)

    expect(response2.body.message).toBe(`We have sent a link to confirm your email to ${email}`)

    expect(mockNotificationService.sendEmailConfirmationCode).toHaveBeenCalledWith({
      email,
      userName: username,
      confirmationCode: expect.any(String),
    })

    const mockCalledConfirmationCode2 =
      mockNotificationService.sendEmailConfirmationCode.mock.calls[0][0]?.confirmationCode

    expect(mockCalledConfirmationCode1).not.toBe(mockCalledConfirmationCode2)
  })

  it.each([
    {
      username: 'short',
      email: 'not valid email',
      password: '',
      equal: {
        message: 'Validation Exception',
        errors: {
          username: {
            property: 'username',
            message: 'username must be longer than or equal to 6 characters',
            meta: {
              value: 'short',
              target: { username: 'short', email: 'not valid email', password: '' },
              children: null,
            },
          },
          email: {
            property: 'email',
            message: 'email must be an email',
            meta: {
              value: 'not valid email',
              target: { username: 'short', email: 'not valid email', password: '' },
              children: null,
            },
          },
          password: {
            property: 'password',
            message: expect.any(String),
            meta: {
              value: '',
              target: { username: 'short', email: 'not valid email', password: '' },
              children: null,
            },
          },
        },
      },
    },
  ])(
    'should not register a user with bad request input',
    async ({ username, email, password, equal }) => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ username, email, password })
        .expect(400)

      expect(response.body).toEqual(equal)
    }
  )

  it('should resend confirmation code if user click resend confirmation code', async () => {
    const username = 'testuser3'
    const email = 'testuser3-1@example.com'
    const password = 'password0aA!='

    const response1 = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, email, password })
      .expect(201)

    expect(response1.body.message).toBe(`We have sent a link to confirm your email to ${email}`)

    expect(mockNotificationService.sendEmailConfirmationCode).toHaveBeenCalledWith({
      email,
      userName: username,
      confirmationCode: expect.any(String),
    })

    const mockCalledConfirmationToken =
      mockNotificationService.sendEmailConfirmationCode.mock.calls[0][0]?.confirmationCode

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

    expect(response1.body.message).toBe(`We have sent a link to confirm your email to ${email}`)

    expect(mockNotificationService.sendEmailConfirmationCode).toHaveBeenCalledWith({
      email,
      userName: username,
      confirmationCode: expect.any(String),
    })

    const mockCalledConfirmationToken =
      mockNotificationService.sendEmailConfirmationCode.mock.calls[0][0]?.confirmationCode

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
