import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export function ApiDeletePost() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete post',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Successfully deleted post',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'If post id incorrect',
    })
  )
}
