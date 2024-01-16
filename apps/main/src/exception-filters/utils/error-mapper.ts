import { type ValidationError } from 'class-validator'
import { isNil } from 'lodash'
import { type ValidationErrorType } from '../types/validation-error.type'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ErrorMapper {
  static mapValidationErrorsToValidationExceptionFilter(
    validationErrors: ValidationError[]
  ): ValidationErrorType {
    return validationErrors.reduce<ValidationErrorType>((acc, validationError) => {
      acc[validationError.property] = {
        property: validationError.property,
        message: Object.values(validationError.constraints ?? [])[0],
        meta: {
          value: validationError.value ?? null,
          target: validationError.target ?? null,
          children:
            !isNil(validationError.children) && validationError.children.length > 0
              ? ErrorMapper.mapValidationErrorsToValidationExceptionFilter(validationError.children)
              : null,
        },
      }
      return acc
    }, {})
  }
}
