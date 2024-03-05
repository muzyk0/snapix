import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export function ApiDeleteUserAvatar() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete user avatar',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Successfully deleted user avatar',
    })
  )
}
