import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ContentPostDto } from '../dto/content-post.dto'

export function ApiCreatePost() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create post',
    }),
    ApiBody({
      type: () => ContentPostDto,
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
