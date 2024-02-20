import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'

import { type User } from '@prisma/client'
import { CryptService } from '../services/crypt.service'
import { PrismaService } from '@app/prisma'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator'

export class ValidateUserCommand {
  @ApiProperty({
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,20}$',
  })
  @IsEmail()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/)
  email!: string

  @ApiProperty({
    minLength: 6,
    maxLength: 20,
    pattern: '/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~]).*/',
  })
  @Length(6, 20)
  @IsNotEmpty()
  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{6,20}$/)
  password!: string

  constructor(email: string, password: string) {
    this.email = email
    this.password = password
  }
}

@CommandHandler(ValidateUserCommand)
export class ValidateUserHandler implements ICommandHandler<ValidateUserCommand> {
  constructor(
    private readonly cryptService: CryptService,
    private readonly prisma: PrismaService
  ) {}

  async execute({ email, password }: ValidateUserCommand): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } })

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
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
