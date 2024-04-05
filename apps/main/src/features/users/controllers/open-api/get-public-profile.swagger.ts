import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export function ApiGetPublicUserProfile() {
  return applyDecorators(
    ApiOperation({
      summary: 'get public user profile information',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Get profile information',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
          },
          userName: {
            type: 'string',
          },
          aboutMe: {
            type: 'string',
            nullable: true,
          },
        },
      },
    })
  )
}
