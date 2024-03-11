import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { CreatePostDto } from '../dto/create-post.dto'

export function ApiCreatePost() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create post',
    }),
    ApiBody({
      type: () => CreatePostDto,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'success',
      schema: {
        type: 'object',
        properties: {
          postId: {
            example: '313',
            type: 'number',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'If the inputModel has incorrect values',
    })
  )
}
