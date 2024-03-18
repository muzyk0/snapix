import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'

export function ApiCreatePost() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create post',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
            pattern: '^[0-9a-zA-Zа-яА-Я\\s!,.?":;\'\\-()/=+*&%$#@^<>[\\]{}|~`€£¥§]+$',
            example: 'Anything that can go wrong will go wrong!',
            maxLength: 2000,
          },
          photoId: {
            type: 'string',
          },
        },
        required: ['photoId'],
      },
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
