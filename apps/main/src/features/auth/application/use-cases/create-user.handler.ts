import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { CryptService } from '../services/crypt.service'
import { PrismaService } from '@app/prisma'
import { randomUUID } from 'crypto'
import { addDays } from 'date-fns'
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator'
import { type User } from '@prisma/client'
import { NotificationService } from '../../../notification/services/notification.service'
import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

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
    private readonly prisma: PrismaService
  ) {}

  async execute({ username, email, password }: CreateUserCommand): Promise<User | null> {
    await this.validateUser({ username, email, password })
    return this.create({ username, email, password })
  }

  async create({ username, email, password }: CreateUserCommand) {
    const passwordHash = await this.cryptService.hashPassword(password)

    const emailConfirmationcode = randomUUID()
    const createdUser = await this.prisma.user.create({
      data: {
        name: username,
        email,
        password: passwordHash,
        emailConfirmed: null,
        emailConfirmation: {
          create: {
            code: emailConfirmationcode,
            expiresIn: addDays(new Date(), 1),
          },
        },
      },
      include: {
        emailConfirmation: true,
      },
    })

    try {
      await this.notificationService.sendEmailConfirmationCode({
        email,
        userName: createdUser.name,
        confirmationCode: emailConfirmationcode,
      })
    } catch (e) {
      throw new Error('Email service is unavailable')
    }

    return this.prisma.user.findUnique({ where: { id: createdUser.id } })
  }

  async validateUser({ username, email }: CreateUserCommand) {
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
