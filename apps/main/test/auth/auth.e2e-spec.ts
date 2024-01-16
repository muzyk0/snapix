import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '@app/prisma'
import { setupInitApp } from '../setupInitApp'
import { mockNotificationService } from '../common/mocks/mockNotificationService'

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

  afterEach(async () => {
    await prisma.user.deleteMany()
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should be defined prisma service', () => {
    expect(prisma).toBeDefined()
  })

  it('should register a new user and send a confirmation email', async () => {
    const username = 'testuser'
    const email = 'testuser@example.com'
    const password = 'test1234'

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
    const password = 'test5678'

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
    const password = 'test5678'

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
            message: 'password should not be empty',
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
