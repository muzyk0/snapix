import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

import { ValidateUserCommand } from '../application/use-cases'
import { type User } from '@prisma/client'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly commandBus: CommandBus) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    })
  }

  async validate(login: string, password: string): Promise<unknown> {
    const user = await this.commandBus.execute<ValidateUserCommand, User | null>(
      new ValidateUserCommand(login, password)
    )
    if (user === null) {
      throw new UnauthorizedException('The email or password are incorrect. Try again please')
    }
    return user
  }
}
