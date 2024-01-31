import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '@app/prisma'
import { setupInitApp } from '../setupInitApp'
import { mockNotificationService } from '../common/mocks/mockNotificationService'
import { clearDbBeforeTest } from '../common/utils/clear-db-before-test'

jest.setTimeout(1000 * 60)

describe('AuthController (e2e) - register', () => {
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

    expect(response.body.message).toBe('UserService with this email is already registered')
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

    expect(response.body.message).toBe('UserService with this username is already registered')
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
            message: expect.any(String),
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
})
