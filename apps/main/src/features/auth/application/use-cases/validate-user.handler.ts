import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'

import { type User } from '@prisma/client'
import { CryptService } from '../services/crypt.service'
import { PrismaService } from '@app/prisma'

export class ValidateUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
}

@CommandHandler(ValidateUserCommand)
export class ValidateUserHandler implements ICommandHandler<ValidateUserCommand> {
  constructor(
    private readonly cryptService: CryptService,
    private readonly prisma: PrismaService
  ) {}

  async execute({ email, password }: ValidateUserCommand): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user?.password) {
      return null
    }

    const isEqual: boolean = await this.cryptService.comparePassword(password, user.password)

    if (!isEqual) {
      return null
    }

    return user
  }
}
