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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { LoginUserCommand } from '../application/use-cases/login-user.handler'
import { Response, Request } from 'express'
import { Public } from '../guards/public.guard'
import { type TokensType } from '../types/tokens.type'
import { Email } from '../application/dto/email.dto'
import { SendRecoveryPasswordTempCodeCommand } from '../application/use-cases/send-recovery-password-temp-code.handler'
import { ValidationExceptionSwaggerDto } from '../../../exception-filters/swagger/validation-exceptiuon-swagger.dto'
import { NewPasswordDto } from '../application/dto/new-password.dto'
import { ConfirmForgotPasswordCommand } from '../application/use-cases/confirm-forgot-password.handler'
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh-auth.guard'
import { JwtPayloadWithRt } from '../types/jwt.type'
import { GetJwtContextDecorator } from '../decorators/get-Jwt-context.decorator'
import { RefreshTokenCommand } from '../application/use-cases/refresh-token.handler'
import { LoginDto } from '../application/dto/login.dto'
import { LogoutCommand } from '../application/use-cases/logout.handler'

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
    @Headers() headers: Record<string, string>,
    @Ip() ip: string,
    @Res({ passthrough: true }) response: Response,
    @Req() req: Request,
    @Body() body: LoginDto
  ) {
    const xForwardedFor = headers['x-forwarded-for']
    const userAgent = req.get('User-Agent')
    const loginResult = await this.commandBus.execute<LoginUserCommand, TokensType>(
      new LoginUserCommand(body.email, userAgent, ip ?? xForwardedFor)
    )

    response.cookie('refreshToken', loginResult.refreshToken, {
      httpOnly: true,
      secure: true,
    })

    return { accessToken: loginResult.accessToken }
  }

  @Post('/logout')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Res({
      passthrough: true,
    })
    res: Response,
    @GetJwtContextDecorator() ctx: JwtPayloadWithRt
  ) {
    await this.commandBus.execute(new LogoutCommand(ctx))

    res.clearCookie('refreshToken')
  }

  @Post('/refresh-token')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @GetJwtContextDecorator() ctx: JwtPayloadWithRt,
    @Ip() ip: string,
    @Headers('x-forwarded-for') xForwardedFor?: string
  ) {
    const tokens: TokensType = await this.commandBus.execute(
      new RefreshTokenCommand(ctx, ip ?? xForwardedFor)
    )

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    })
    return { accessToken: tokens.accessToken }
  }

  @ApiBody({
    type: () => Email,
  })
  @ApiOkResponse({
    status: HttpStatus.ACCEPTED,
    description: 'New password has been sent to your email',
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

  @ApiBody({
    type: () => NewPasswordDto,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Set new password with recovery token',
  })
  @Public()
  @Post('/new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmRecoveryPassword(@Body() { password, token }: NewPasswordDto) {
    return this.commandBus.execute<ConfirmForgotPasswordCommand>(
      new ConfirmForgotPasswordCommand(token, password)
    )
  }
}
