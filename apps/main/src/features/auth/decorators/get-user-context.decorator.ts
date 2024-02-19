import { createParamDecorator, type ExecutionContext } from '@nestjs/common'

import { isNil } from 'lodash'
import { type JwtAtPayload, type JwtPayloadWithRt } from '../types/jwt.type'

type Payload = JwtAtPayload | JwtPayloadWithRt

export const GetUserContextDecorator = createParamDecorator(
  (data: keyof Payload, context: ExecutionContext): Payload => {
    const request = context.switchToHttp().getRequest()
    const ctx = request.user

    if (isNil(ctx)) {
      throw new Error('JWTGuard must be used')
    }

    if (!isNil(data)) {
      return ctx[data]
    }

    return ctx
  }
)
