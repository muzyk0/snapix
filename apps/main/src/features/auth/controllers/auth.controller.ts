import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Ip,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { type User } from '@prisma/client'
import { LoginUserCommand } from '../application/use-cases/login-user.handler'
import { Response } from 'express'
import { Public } from '../guards/public.guard'
import { LoginHeaders } from '../types/login-headers'
import { passRecoveryDTO } from '../types/pass-recovery-dto-type'
import { RecoveryPasswordCommand } from '../application/use-cases/recovery-pass.handler'
import { newPasswordDTO } from '../types/new-pass-dto-type'
import { UpdatePasswordCommand } from '../application/use-cases/update-pass.handler'

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

  @ApiOkResponse({})
  @Post('/password-recovery')
  @Public()
  @HttpCode(HttpStatus.OK)
  async passwordRecovery(@Body() inputDTO: passRecoveryDTO) {
    const result = await this.commandBus.execute(new RecoveryPasswordCommand(inputDTO.email))

    if (result.error === true) {
      throw new HttpException(result.message, result.status)
    }

    return {
      message: result.message,
    }
  }

  @ApiOkResponse({})
  @Post('/new-password/:recoveryCode')
  @Public()
  @HttpCode(HttpStatus.OK)
  async newPassword(@Param('recoveryCode') recoveryCode: string, @Body() inputDTO: newPasswordDTO) {
    const result = await this.commandBus.execute(
      new UpdatePasswordCommand(inputDTO.password, recoveryCode)
    )

    if (result.error === true) {
      throw new HttpException(result.message, result.status)
    }

    return {
      message: result.message,
    }
  }
}
