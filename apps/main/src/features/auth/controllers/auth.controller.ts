import {
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
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { type User } from '@prisma/client'
import { LoginUserCommand } from '../application/use-cases/login-user.handler'
import { Request, Response } from 'express'
import { Public } from '../guards/public.guard'
import { type TokensType } from '../types/tokens.type'

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
}
