import { Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { JwtService } from '@nestjs/jwt'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    // todo: remove
    private readonly jwtService: JwtService
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
}
