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
