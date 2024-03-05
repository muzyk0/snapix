import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export function ApiUploadUserAvatar() {
  return applyDecorators(
    ApiOperation({
      summary: 'Uploads the user avatar.',
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description:
        'Uploads the user avatar. Returns an array of uploaded images with must contain medium photo size (192x192) and thumbnail size (48x48).',
      schema: {
        type: 'object',
        properties: {
          avatars: {
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
            example: [
              {
                url: 'https://cdn.com/image.png',
                width: 192,
                height: 192,
                size: 1024,
              },
              {
                url: 'https://cdn.com/image.png',
                width: 48,
                height: 48,
                size: 1024,
              },
            ],
          },
        },
      },
    })
  )
}
