import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { CreatePostDto } from '../dto/create-post.dto'

export function ApiUpdatePost() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create post',
    }),
    ApiBody({
      type: () => CreatePostDto,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'success',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'If the inputModel has incorrect values',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'If post id incorrect',
    })
  )
}
