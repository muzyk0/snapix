import { type ValidationError } from 'class-validator'

export type ValidationErrorType = Record<
  string,
  {
    meta: {
      value: ValidationError['value'] | null
      target: ValidationError['target'] | null
      children: ValidationErrorType | null
    }
    property: string
    message: string
  }
>
