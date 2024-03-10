import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { GetPostTypes } from '../../types/getPost.types'

export function ApiGetPost() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get post',
    }),
    ApiBody({
      type: () => GetPostTypes,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'success',
      schema: {
        type: 'object',
        properties: {
          id: {
            example: 313,
            type: 'number',
          },
          photoId: {
            example: 'string',
            type: 'string',
          },
          content: {
            example: 'string',
            type: 'string',
          },
          authorId: {
            example: 313,
            type: 'number',
          },
          createdAt: {
            example: '2024-03-10 14:27:20.034',
            type: 'date string',
          },
          updatedAt: {
            example: '2024-03-10 14:27:20.034',
            type: 'string',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'If post id incorrect',
    })
  )
}
