import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CreateUserCommand } from '../application/use-cases'
import { ValidationExceptionSwaggerDto } from '../../../exception-filters/swagger/validation-exceptiuon-swagger.dto'
import { Public } from '../guards/public.guard'
import { ConfirmRegisterCommand } from '../application/use-cases/confirm-register.handler'
import {
  type ConfirmRegisterDto,
  ConfirmRegisterSwaggerDto,
} from '../application/dto/confirm-register.dto'
import { ResendConfirmationTokenCommand } from '../application/use-cases/resend-confirmation-token.handler'
import { Email } from '../application/dto/email.dto'
import { I18n, I18nContext } from 'nestjs-i18n'
import { type I18nPath, type I18nTranslations } from '../../../generated/i18n.generated'
// import { type I18nTranslations } from '../../../generated/i18n.generated'

@ApiTags('auth')
@Controller('/auth/register')
export class RegisterController {
  constructor(
    // todo: remove
    private readonly commandBus: CommandBus
  ) {}

  @ApiBody({
    type: () => CreateUserCommand,
  })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'UserService has been registered',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
    type: ValidationExceptionSwaggerDto,
  })
  @Public()
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(
    @Body() { username, email, password }: CreateUserCommand,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    const i18nCode = await this.commandBus.execute<CreateUserCommand, I18nPath>(
      new CreateUserCommand(username, email, password)
    )

    return {
      message: i18n.t(i18nCode, {
        args: { email },
      }),
    }
  }

  @ApiBody({
    type: () => ConfirmRegisterCommand,
  })
  @ApiOkResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Registration successful',
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Invalid token',
    type: ConfirmRegisterSwaggerDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
    type: ValidationExceptionSwaggerDto,
  })
  @Public()
  @Post('/confirm')
  @HttpCode(HttpStatus.ACCEPTED)
  async confirmAccount(@Body() { token }: ConfirmRegisterCommand): Promise<ConfirmRegisterDto> {
    return this.commandBus.execute<ConfirmRegisterCommand, ConfirmRegisterDto>(
      new ConfirmRegisterCommand(token)
    )
  }

  @ApiBody({
    type: () => Email,
  })
  @ApiOkResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Resend confirmation token and send email',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
    type: ValidationExceptionSwaggerDto,
  })
  @Public()
  @Post('/resend-confirmation-token')
  @HttpCode(HttpStatus.ACCEPTED)
  async resendConfirmationCode(@Body() { email }: Email) {
    return this.commandBus.execute(new ResendConfirmationTokenCommand(email))
  }
}
