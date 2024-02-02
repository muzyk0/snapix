import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { type User } from '@prisma/client'
import { LoginUserCommand } from '../application/use-cases/login-user.handler'
import { Request, Response } from 'express'
import { Public } from '../guards/public.guard'
import { type TokensType } from '../types/tokens.type'
import { Email } from '../application/dto/email.dto'
import { SendRecoveryPasswordTempCodeCommand } from '../application/use-cases/send-recovery-password-temp-code.handler'
import { ValidationExceptionSwaggerDto } from '../../../exception-filters/swagger/validation-exceptiuon-swagger.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOkResponse({})
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Headers('x-forwarded-for') xForwardedFor: string,
    @Ip() ip: string,
    @Res({ passthrough: true }) response: Response,
    @Req() req: Request
  ) {
    const loginResult = await this.commandBus.execute<LoginUserCommand, TokensType>(
      new LoginUserCommand(req.user as User, ip ?? xForwardedFor)
    )

    response.cookie('refreshToken', loginResult.refreshToken, {
      httpOnly: true,
      secure: true,
    })

    return { accessToken: loginResult.accessToken }
  }

  @ApiBody({
    type: () => Email,
  })
  @ApiOkResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Registration successful',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
    type: ValidationExceptionSwaggerDto,
  })
  @Public()
  @Post('/forgot-password')
  @HttpCode(HttpStatus.ACCEPTED)
  async recoveryPassword(@Body() { email }: Email) {
    return this.commandBus.execute(new SendRecoveryPasswordTempCodeCommand(email))
  }
}
