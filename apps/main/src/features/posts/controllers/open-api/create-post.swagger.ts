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
          content: {
            type: 'string',
            example: 'Anything that can go wrong will go wrong!',
            pattern:
              '/^[0-9a-zA-Zа-яА-Я\\s!,.?":;\'\\-()/=+*&%$#@^<>[\\]{}|~`€£¥§]+$/^[a-zA-Z0-9._%+-]',
            maxLength: 2000,
            nullable: true,
          },
          photoId: {
            type: 'string',
            example: 'photoId',
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
