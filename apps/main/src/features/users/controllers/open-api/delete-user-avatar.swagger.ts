import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export function ApiDeleteUserAvatar() {
  return applyDecorators(
    ApiOperation({
      summary: '',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Successfully deleted user avatar',
    })
  )
}
