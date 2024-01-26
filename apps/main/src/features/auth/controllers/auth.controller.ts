import {
  Controller,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Ip,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { type User } from '@prisma/client'
import { LoginHeaders } from '../types/login-headers'
import { LoginUserCommand } from '../application/use-cases/login-user.handler'
import { Response } from 'express'
import { Public } from '../guards/public.guard'

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
}
