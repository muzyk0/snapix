import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { UpdateProfileDto } from '../dto/update-profile.dto'

export function ApiUpdateUserProfile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update user profile',
    }),
    ApiBody({
      type: () => UpdateProfileDto,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Your settings are saved!',
      schema: {
        type: 'object',
        properties: {
          userName: {
            type: 'string',
            example: 'John009',
            pattern: '^[a-zA-Z0-9_-]+$',
            minLength: 6,
            maxLength: 30,
          },
          firstName: {
            type: 'string',
            example: 'John',
            pattern: '^([a-zA-Zа-яА-Я]+)$',
            minLength: 1,
            maxLength: 50,
          },
          lastName: {
            type: 'string',
            example: 'Carter',
            pattern: '^([a-zA-Zа-яА-Я]+)$',
            minLength: 6,
            maxLength: 30,
          },
          birthDate: {
            type: 'string',
            example: '22.09.2010',
            pattern: '^\\d{2}\\.\\d{2}\\.\\d{4}$',
            nullable: true,
          },
          city: {
            type: 'string',
            example: 'Paris',
            pattern: '^[a-zA-Zа-яА-Я\\s\\-]+$',
            nullable: true,
          },
          aboutMe: {
            type: 'string',
            example: 'A good man from the amazing city of Paris!',
            pattern:
              '/^[0-9a-zA-Zа-яА-Я\\s!,.?":;\'\\-()/=+*&%$#@^<>[\\]{}|~`€£¥§]+$/^[a-zA-Z0-9._%+-]',
            maxLength: 200,
            nullable: true,
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'If the inputModel has incorrect values',
    }),
    ApiResponse({
      status: HttpStatus.NOT_ACCEPTABLE,
      description: 'A user under 13 cannot create a profile. Privacy Policy',
    })
  )
}
