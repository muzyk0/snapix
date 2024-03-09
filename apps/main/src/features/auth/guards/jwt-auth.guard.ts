import { applyDecorators, Injectable, UseGuards } from '@nestjs/common'
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'

@Injectable()
export class JwtAuthGuard extends PassportAuthGuard('jwt-access') {}

export const AuthGuard = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth('accessToken'),
    ApiUnauthorizedResponse({
      status: 401,
      description: 'Unauthorized',
    })
  )
