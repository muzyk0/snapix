import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export function ApiGetPosts() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get user posts',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'success',
      schema: {
        type: 'object',
        properties: {
          id: {
            example: 313,
            type: 'number',
          },
          imageId: {
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
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            example: '2024-03-10 14:27:20.034',
            type: 'string',
            format: 'date-time',
          },
          photo: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  example: 'https://cdn.com/image.png',
                },
                width: {
                  type: 'number',
                  default: 192,
                },
                height: {
                  type: 'number',
                  default: 192,
                },
                size: {
                  type: 'number',
                },
              },
            },
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
