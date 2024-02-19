import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiBadRequestResponse } from '@nestjs/swagger'
import { ValidationExceptionSwaggerDto } from '../validation-exceptiuon-swagger.dto'

export const ApiValidationException = () =>
  applyDecorators(
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation failed',
      type: ValidationExceptionSwaggerDto,
    })
  )
