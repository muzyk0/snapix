import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'

export function ApiUpdatePost() {
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
        },
      },
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
