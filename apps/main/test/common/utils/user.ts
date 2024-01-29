import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { type CreateUserCommand } from '../../../src/features/auth/application/use-cases'
import { isNil } from 'lodash'

interface ExpressionMap {
  conditions: {
    isUserCanBeCreated: boolean
    isLogged: boolean
  }
  user: {
    username: string
    email: string
  } | null
  credentials: CreateUserCommand | null
  accessToken: string | null
}

export class FakeUserBuilder {
  private readonly created: {
    user: {
      username: string
      email: string
    } | null
    credentials: CreateUserCommand | null
    accessToken: string | null
  } = {
    user: null,
    credentials: null,
    accessToken: null,
  }

  private readonly expressionMap: ExpressionMap = {
    conditions: {
      isUserCanBeCreated: false,
      isLogged: false,
    },
    credentials: null,
    user: null,
    accessToken: null,
  }

  constructor(private readonly app: INestApplication) {}

  async confirmRegistration(token: string) {
    await request(this.app.getHttpServer())
      .post('/auth/register/confirm')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send({
        token,
      })
      .expect(203)
      .then(response => response.body)
  }

  create(createUserDto: CreateUserCommand) {
    this.expressionMap.credentials = {
      username: createUserDto.username,
      email: createUserDto.email,
      password: createUserDto.password,
    }

    this.expressionMap.conditions.isUserCanBeCreated = true

    return this
  }

  login() {
    this.expressionMap.conditions.isLogged = true
    return this
  }

  async build(): Promise<FakeUserBuilder['created']> {
    if (this.expressionMap.conditions.isUserCanBeCreated) {
      await this._create()
    }

    if (this.expressionMap.conditions.isLogged) {
      await this._login()
    }

    return this.created
  }

  private async _create() {
    if (isNil(this.expressionMap.credentials)) {
      throw new Error('Credentials must not be empty')
    }

    const response: {
      username: string
      email: string
    } = await request(this.app.getHttpServer())
      .post('/sa/users')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(this.expressionMap.credentials)
      .then(response => response.body)

    this.created.user = response
  }

  private async _login() {
    if (isNil(this.expressionMap.credentials)) {
      throw new Error('Credentials must not be empty')
    }

    const responseToken: { accessToken: string } = await request(this.app.getHttpServer())
      .post('/auth/login')
      .set('User-Agent', 'for test')
      .send({
        email: this.expressionMap.credentials.email,
        password: this.expressionMap.credentials.password,
      })
      .then(response => response.body)
    this.created.accessToken = responseToken.accessToken
  }
}
