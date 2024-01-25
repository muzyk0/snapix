import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Request,
  HttpException,
  Ip,
  Headers,
} from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { CreateUserCommand } from '../application/use-cases'
import { type User } from '@prisma/client'
import { ValidationExceptionSwaggerDto } from '../../../exception-filters/swagger/validation-exceptiuon-swagger.dto'
import { LoginUserCommand } from '../application/use-cases/login-user.handler'
import { Response } from 'express'
import { LoginHeaders } from '../types/login-headers'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOkResponse({})
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Headers() loginHeaders: LoginHeaders,
    @Ip() IP: string,
    @Res({ passthrough: true }) response: Response,
    @Request() req: any
  ) {
    const loginResult = await this.commandBus.execute(
      new LoginUserCommand(req.user as User, IP, loginHeaders)
    )

    if (loginResult.error === true) {
      throw new HttpException(loginResult.message, loginResult.status)
    }

    response.cookie('refreshToken', loginResult.refreshToken, {
      httpOnly: true,
      secure: true,
    })

    return { accessToken: loginResult.accessToken }
  }

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
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() { username, email, password }: CreateUserCommand) {
    await this.commandBus.execute<CreateUserCommand, User | null>(
      new CreateUserCommand(username, email, password)
    )

    return {
      message: `We have sent a link to confirm your email to ${email}`,
    }
  }
}
