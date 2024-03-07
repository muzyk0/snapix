import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { mockNotificationService } from '../mocks/mockNotificationService'
import { type CorrectUser } from '../../profile/profile-input-value'

export const registerConfirmAndLogin = async (
  app: INestApplication,
  user: CorrectUser
): Promise<string> => {
  // Register user
  await request(app.getHttpServer())
    .post('/auth/register')
    .send({
      username: user.username,
      password: user.password,
      email: user.email,
    })
    .expect(201)

  // Get token

  const refreshToken = mockNotificationService.sendEmailConfirmationCode.mock.calls[0][0]?.token

  // Confirm user registration
  await request(app.getHttpServer())
    .post('/auth/register/confirm')
    .send({ token: refreshToken })
    .expect(202)
    .then(res => res.body)

  // Login user
  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      email: user.email,
      password: user.password,
    })
    .expect(200)

  return loginResponse.body.accessToken
}
