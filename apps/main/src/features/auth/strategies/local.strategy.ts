import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

import { ValidateUserCommand } from '../application/use-cases/validate-user.handler'
import { type User } from '@prisma/client'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly commandBus: CommandBus) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    })
  }

  async validate(login: string, password: string): Promise<any> {
    const user = await this.commandBus.execute<ValidateUserCommand, User | null>(
      new ValidateUserCommand(login, password)
    )
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
