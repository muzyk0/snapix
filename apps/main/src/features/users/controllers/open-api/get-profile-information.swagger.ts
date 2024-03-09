import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'

export function ApiGetUserProfileInfo() {
  return applyDecorators(
    ApiBearerAuth('accessToken'),
    ApiOperation({
      summary: 'get user profile information',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Get profile information',
      schema: {
        type: 'object',
        properties: {
          userName: {
            type: 'string',
          },
          firstName: {
            type: 'string',
          },
          lastName: {
            type: 'string',
          },
          birthDate: {
            type: 'string',
            nullable: true,
          },
          city: {
            type: 'string',
            nullable: true,
          },
          aboutMe: {
            type: 'string',
            nullable: true,
          },
          lastUpdate: {
            type: 'Date',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
    })
  )
}
