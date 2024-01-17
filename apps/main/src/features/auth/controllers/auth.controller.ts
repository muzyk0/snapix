import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { JwtService } from '@nestjs/jwt'
import { CreateUserCommand } from '../application/use-cases'
import { type User } from '@prisma/client'
import { ValidationExceptionSwaggerDto } from '../../../exception-filters/swagger/validation-exceptiuon-swagger.dto'

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
    type: () => CreateUserCommand,
  })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'User has been registered',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
    type: ValidationExceptionSwaggerDto,
  })
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() { username, email, password }: CreateUserCommand) {
    await this.commandBus.execute<CreateUserCommand, User | null>(
      new CreateUserCommand(username, email, password)
    )

    return {
      message: `We have sent a link to confirm your email to ${email}`,
    }
  }
}
