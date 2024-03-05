import { Body, Controller, Get, Ip, Post, Req, Res, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { GetUserContextDecorator } from '../decorators/get-user-context.decorator'
import { GoogleOAuthGuard } from '../guards/google-oauth.guard'
import { LoginByExternalAccountCommand } from '../application/use-cases/login-by-external-account.handler'
import { ExternalAccount } from '../types/externalAccount'
import { CreateSessionCommand } from '../application/use-cases/create-session.handler'
import type { TokensType } from '../types/tokens.type'
import { type User } from '@prisma/client'
import { ExchangeTokenCommand } from '../application/use-cases/exchange-token.handler'
import { ExchangeTokenDto } from '../application/dto/exchange-token.dto'

@ApiTags('oauth')
@Controller('oauth')
export class OAuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(GoogleOAuthGuard)
  @Get('/google')
  async googleAuth() {}

  @Get('/google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(
    @Req() req: Request,
    @Res() res: Response,
    @Ip() ip: string,
    @GetUserContextDecorator() ctx: ExternalAccount
  ) {
    const userAgent = req.get('User-Agent')
    const { id: userId } = await this.commandBus.execute<LoginByExternalAccountCommand, User>(
      new LoginByExternalAccountCommand(ctx)
    )

    const session = await this.commandBus.execute<CreateSessionCommand, TokensType>(
      new CreateSessionCommand(userId, userAgent, ip)
    )

    res.redirect(`https://9art.ru/authSuccess?token=${session.refreshToken}`)
  }

  @Post('/exchange-token')
  async exchangeToken(
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
    @Body() body: ExchangeTokenDto
  ) {
    const tokens: TokensType = await this.commandBus.execute<ExchangeTokenCommand, TokensType>(
      new ExchangeTokenCommand(body.token, ip)
    )

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    })

    return { accessToken: tokens.accessToken }
  }
}
