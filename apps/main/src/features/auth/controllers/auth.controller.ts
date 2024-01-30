import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { JwtService } from '@nestjs/jwt'
import { Email } from '../application/dto/email.dto'
import { CommandBus } from '@nestjs/cqrs'
import { SendRecoveryPasswordTempCodeCommand } from '../application/use-cases/send-recovery-password-temp-code.handler'
import { ValidationExceptionSwaggerDto } from '../../../exception-filters/swagger/validation-exceptiuon-swagger.dto'
import { Public } from '../guards/public.guard'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    // todo: remove
    private readonly jwtService: JwtService,
    private readonly commandBus: CommandBus
  ) {}

  @ApiOkResponse({})
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login() {
    return {
      accessToken: this.jwtService.sign({}, { secret: '123456', expiresIn: '1d' }),
    }
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
  @Post('/password-recovery')
  @HttpCode(HttpStatus.ACCEPTED)
  async recoveryPassword(@Body() { email }: Email) {
    return this.commandBus.execute(new SendRecoveryPasswordTempCodeCommand(email))
  }
}
