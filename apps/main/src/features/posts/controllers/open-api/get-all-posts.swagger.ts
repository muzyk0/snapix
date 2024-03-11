import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export function ApiGetPost() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get post',
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
          photo: {
            type: 'object',
            items: {
              type: 'array',
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
