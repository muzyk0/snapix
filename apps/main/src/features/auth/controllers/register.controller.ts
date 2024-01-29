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
import { type User } from '@prisma/client'
import { ValidationExceptionSwaggerDto } from '../../../exception-filters/swagger/validation-exceptiuon-swagger.dto'
import { Public } from '../guards/public.guard'
import { ConfirmRegisterCommand } from '../application/use-cases/confirm-register.handler'
import {
  type ConfirmRegisterDto,
  ConfirmRegisterSwaggerDto,
} from '../application/dto/confirm-register.dto'
import { ResendConfirmationCodeCommand } from '../application/use-cases/resend-confirmation-code.handler'

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
    description: 'User has been registered',
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
  async registerUser(@Body() { username, email, password }: CreateUserCommand) {
    await this.commandBus.execute<CreateUserCommand, User | null>(
      new CreateUserCommand(username, email, password)
    )

    return {
      message: `We have sent a link to confirm your email to ${email}`,
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

  @Public()
  @Post('/resend-confirmation-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendConfirmationCode(@Body() { email }: ResendConfirmationCodeCommand) {
    return this.commandBus.execute(new ResendConfirmationCodeCommand(email))
  }
}
