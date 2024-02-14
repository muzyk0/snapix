import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { CryptService } from '../services/crypt.service'
import { PrismaService } from '@app/prisma'
import { randomUUID } from 'crypto'
import { addDays } from 'date-fns'
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator'
import { NotificationService } from '../../../notification/services/notification.service'
import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { UserService } from '../../../users/services/user.service'
import { type I18nPath } from '../../../../../generated/i18n.generated'

export class CreateUserCommand {
  @ApiProperty({
    minLength: 6,
    maxLength: 30,
    pattern: '^[a-zA-Z0-9_-]+$',
  })
  @Length(6, 30)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/)
  username!: string

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

  constructor(username: string, email: string, password: string) {
    this.username = username
    this.email = email
    this.password = password
  }
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly cryptService: CryptService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async execute(dto: CreateUserCommand): Promise<I18nPath> {
    const isUserExistAndNotConfirmed = await this.isUserExistAndNotConfirmed(dto)
    if (isUserExistAndNotConfirmed) {
      return this.resendConfirmationCode(dto)
    }
    await this.validateUserAndThrowError(dto)
    return this.create(dto)
  }

  async create({ username, email, password }: CreateUserCommand): Promise<I18nPath> {
    const passwordHash = await this.cryptService.hashPassword(password)

    const emailConfirmationToken = randomUUID()
    const createdUser = await this.prisma.user.create({
      data: {
        name: username,
        email,
        password: passwordHash,
        emailConfirmed: null,
        emailConfirmation: {
          create: {
            token: emailConfirmationToken,
            expiresAt: addDays(new Date(), 1),
          },
        },
      },
      include: {
        emailConfirmation: true,
      },
    })

    await this.notificationService.sendEmailConfirmationCode({
      email,
      userName: createdUser.name,
      token: emailConfirmationToken,
    })

    return 'register.account.new'
  }

  async resendConfirmationCode({ email }: CreateUserCommand): Promise<I18nPath> {
    await this.userService.sendConfirmationToken(email)
    return 'register.account.new-without-confirm-email'
  }

  async isUserExistAndNotConfirmed({ username, email }: CreateUserCommand): Promise<boolean> {
    const userWithEmailsExistsAndNotConfirmed = await this.prisma.user.findUnique({
      where: {
        email,
        name: username,
        emailConfirmed: null,
      },
    })
    return userWithEmailsExistsAndNotConfirmed !== null
  }

  async validateUserAndThrowError({ username, email }: CreateUserCommand) {
    await this.validateEmail(email)
    await this.validateUsername(username)
  }

  async validateEmail(email: string) {
    const userWithEmailsExists = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithEmailsExists !== null) {
      throw new BadRequestException({
        message: 'User with this email is already registered',
      })
    }
  }

  async validateUsername(username: string) {
    const userWithEmailsExists = await this.prisma.user.findUnique({
      where: {
        name: username,
      },
    })

    if (userWithEmailsExists !== null) {
      throw new BadRequestException({
        message: 'User with this username is already registered',
      })
    }
  }
}
