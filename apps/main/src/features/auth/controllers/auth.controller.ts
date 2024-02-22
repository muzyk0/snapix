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
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiBody, ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { Request, Response } from 'express'
import { Public } from '../guards/public.guard'
import { type TokensType } from '../types/tokens.type'
import { Email } from '../application/dto/email.dto'
import { SendRecoveryPasswordTempCodeCommand } from '../application/use-cases/send-recovery-password-temp-code.handler'
import { NewPasswordDto } from '../application/dto/new-password.dto'
import { ConfirmForgotPasswordCommand } from '../application/use-cases/confirm-forgot-password.handler'
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh-auth.guard'
import { JwtPayloadWithRt } from '../types/jwt.type'
import { GetUserContextDecorator } from '../decorators/get-user-context.decorator'
import { RefreshTokenCommand } from '../application/use-cases/refresh-token.handler'
import { LogoutCommand } from '../application/use-cases/logout.handler'
import { CreateSessionCommand } from '../application/use-cases/create-session.handler'
import { type User } from '@prisma/client'
import { ValidateUserCommand } from '../application/use-cases'
import { ApiValidationException } from '../../../exception-filters/swagger/decorators/api-validation-exception'
import { VerifyForgotPasswordTokenQuery } from '../application/use-cases/verify-forgot-password-token.handler'
import type { ConfirmRegisterDto } from '../application/dto/confirm-register.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns access token in body and refresh token in cookie',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
        },
      },
    },
  })
  @ApiBody({ type: ValidateUserCommand })
  @ApiValidationException()
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Headers() headers: Record<string, string>,
    @Ip() ip: string,
    @Res({ passthrough: true }) response: Response,
    @Req() req: Request,
    @GetUserContextDecorator() ctx: User
  ) {
    const xForwardedFor = headers['x-forwarded-for']
    const userAgent = req.get('User-Agent')

    const session = await this.commandBus.execute<CreateSessionCommand, TokensType>(
      new CreateSessionCommand(ctx.id, userAgent, ip ?? xForwardedFor)
    )

    response.cookie('refreshToken', session.refreshToken, {
      httpOnly: false,
      secure: false,
    })

    return { accessToken: session.accessToken }
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Clears refresh token in cookie',
  })
  @ApiCookieAuth('refreshToken')
  @Public()
  @Post('/logout')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Res({
      passthrough: true,
    })
    res: Response,
    @GetUserContextDecorator() ctx: JwtPayloadWithRt
  ) {
    await this.commandBus.execute(new LogoutCommand(ctx))

    res.clearCookie('refreshToken')
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns access token in body and refresh token in cookie',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
        },
      },
    },
  })
  @ApiCookieAuth('refreshToken')
  @Public()
  @Post('/refresh-token')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @GetUserContextDecorator() ctx: JwtPayloadWithRt,
    @Ip() ip: string,
    @Headers() headers: Record<string, string>
  ) {
    const xForwardedFor = headers['x-forwarded-for']
    const tokens: TokensType = await this.commandBus.execute(
      new RefreshTokenCommand(ctx, ip ?? xForwardedFor)
    )

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: false,
      secure: false,
    })
    return { accessToken: tokens.accessToken }
  }

  @ApiBody({
    type: () => Email,
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'New password has been sent to your email',
  })
  @ApiValidationException()
  @Public()
  @Post('/forgot-password')
  @HttpCode(HttpStatus.ACCEPTED)
  async recoveryPassword(@Body() { email }: Email) {
    return this.commandBus.execute(new SendRecoveryPasswordTempCodeCommand(email))
  }

  @ApiBody({
    type: () => VerifyForgotPasswordTokenQuery,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token has been verified',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Invalid token',
  })
  @ApiValidationException()
  @Public()
  @Post('/forgot-password/verify-token')
  @HttpCode(HttpStatus.OK)
  async verifyToken(
    @Body() { token }: VerifyForgotPasswordTokenQuery
  ): Promise<ConfirmRegisterDto> {
    return this.queryBus.execute<VerifyForgotPasswordTokenQuery, ConfirmRegisterDto>(
      new VerifyForgotPasswordTokenQuery(token)
    )
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
