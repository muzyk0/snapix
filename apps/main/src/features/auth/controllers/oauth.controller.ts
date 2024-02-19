import { Controller, Get, Headers, Ip, Req, Res, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { Public } from '../guards/public.guard'
import { GetUserContextDecorator } from '../decorators/get-user-context.decorator'
import { GoogleOAuthGuard } from '../guards/google-oauth.guard'
import { LoginByExternalAccountCommand } from '../application/use-cases/login-by-external-account.handler'
import { ExternalAccount } from '../types/externalAccount'
import { CreateSessionCommand } from '../application/use-cases/create-session.handler'
import type { TokensType } from '../types/tokens.type'

@ApiTags('oauth')
@Controller('oauth')
export class OAuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Public()
  @UseGuards(GoogleOAuthGuard)
  @Get('/google')
  async googleAuth() {}

  @Public()
  @Get('/google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(
    @Headers() headers: Record<string, string>,
    @Req() req: Request,
    @Res() res: Response,
    @Ip() ip: string,
    @GetUserContextDecorator() ctx: ExternalAccount
  ) {
    const xForwardedFor = headers['x-forwarded-for']
    const userAgent = req.get('User-Agent')
    const userId = await this.commandBus.execute<LoginByExternalAccountCommand, number>(
      new LoginByExternalAccountCommand(ctx)
    )

    const session = await this.commandBus.execute<CreateSessionCommand, TokensType>(
      new CreateSessionCommand(userId, userAgent, ip ?? xForwardedFor)
    )

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      secure: true,
    })

    return { accessToken: session.accessToken }
  }
}
