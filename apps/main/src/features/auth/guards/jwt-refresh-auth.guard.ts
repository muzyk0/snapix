import { applyDecorators, Injectable, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {}

export const RefreshAuthGuard = () =>
  applyDecorators(
    UseGuards(JwtRefreshAuthGuard),
    ApiCookieAuth('refreshToken'),
    ApiUnauthorizedResponse({
      status: 401,
      description: 'Unauthorized, invalid refresh token',
    })
  )
