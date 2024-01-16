import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { CryptService } from '../services/crypt.service'
import { type CreateUserDto } from '../dto/create-user.dto'
import { PrismaService } from '@app/prisma'
import { randomUUID } from 'crypto'
import { addDays } from 'date-fns'
import { IsEmail, IsNotEmpty, Length } from 'class-validator'
import { type User } from '@prisma/client'
import { NotificationService } from '../../../notification/services/notification.service'
import { BadRequestException } from '@nestjs/common'

export class CreateUserCommand {
  @Length(6, 30)
  @IsNotEmpty()
  username!: string

  @IsEmail()
  @IsNotEmpty()
  email!: string

  @Length(6, 20)
  @IsNotEmpty()
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

  async create({ username, email, password }: CreateUserDto) {
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

  async validateUser({ username, email }: CreateUserDto) {
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
