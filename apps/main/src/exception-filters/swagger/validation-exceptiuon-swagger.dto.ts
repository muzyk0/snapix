import { ApiExtraModels, ApiProperty } from '@nestjs/swagger'

class ErrorMeta {
  @ApiProperty({
    description: 'The value of the input property',
    nullable: true,
    example: 'username',
  })
  value!: string

  @ApiProperty({
    description: 'The input model',
    nullable: true,
    example: {
      username: 'short',
      email: 'not valid email',
      password: '',
    },
  })
  target!: string

  @ApiProperty({
    description: 'Some keys of the input nested fields',
    nullable: true,
    example: {
      property: 'email',
      message: 'email must be an email',
      meta: {
        value: 'info 9art.ru',
        target: { username: 'short', email: 'not valid email', password: '' },
        children: null,
      },
    },
    type: () => ErrorProperty,
  })
  children!: unknown
}

class ErrorDto {
  @ApiProperty({
    description: 'The name of the property that failed validation',
    example: 'username',
  })
  property!: string

  @ApiProperty({
    description: 'The error message for the property',
    example: 'username must be longer than or equal to 6 characters',
  })
  message!: string

  @ApiProperty({
    description: 'The meta data for the property',
    example: {
      value: 'short',
      target: { username: 'short', email: 'not valid email', password: '' },
      children: null,
    },
  })
  meta!: ErrorMeta
}

class ErrorProperty {
  @ApiProperty({
    description: 'Some keys of the input fields',
    example: {
      property: 'email',
      message: 'email must be an email',
      meta: {
        value: 'info 9art.ru',
        target: { username: 'short', email: 'not valid email', password: '' },
        children: null,
      },
    },
  })
  'some property'!: ErrorDto
}

@ApiExtraModels(ErrorDto)
export class ValidationExceptionSwaggerDto {
  @ApiProperty({ description: 'Validation Exception' })
  message!: string

  @ApiProperty({
    description: 'The validation errors object with some keys of the input fields',
    example: {
      email: {
        property: 'email',
        message: 'email must be an email',
        meta: {
          value: 'info 9art.ru',
          target: { username: 'short', email: 'not valid email', password: '' },
          children: null,
        },
      },
    },
  })
  errors!: ErrorProperty
}
