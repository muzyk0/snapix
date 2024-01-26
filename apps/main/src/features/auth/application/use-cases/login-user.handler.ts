import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { JwtService } from '@nestjs/jwt'
import { type User } from '@prisma/client'
import { HttpStatus } from '@nestjs/common'
import { type JwtAtPayload } from '../../types/jwt-at-payload'
import { type LoginHeaders } from '../../types/login-headers'
import { type CreateSessionDTO } from '../../types/create-session-dto-type'
import { SessionsRepo } from '../../infrastructure/sessions.repository'
import { AppConfigService } from '@app/config'

export class LoginUserCommand {
  constructor(
    public readonly user: User,
    public readonly IP: string,
    public readonly loginHeaders: LoginHeaders
  ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
    private readonly sessionRepo: SessionsRepo
  ) {}

  async execute(command: LoginUserCommand): Promise<any> {
    try {
      const { user } = command

      const jwtPayload: JwtAtPayload = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      }

      const accessToken = await this.jwtService.signAsync(jwtPayload, {
        secret: this.appConfigService.accessTokenSecret,
        expiresIn: this.appConfigService.accessTokenSecretExpiresIn,
      })

      const refreshToken = await this.jwtService.signAsync(jwtPayload, {
        secret: this.appConfigService.refreshTokenSecret,
        expiresIn: this.appConfigService.refreshTokenSecretExpiresIn,
      })

      await this.createSession(command, refreshToken)

      return { accessToken, refreshToken, error: false }
    } catch (e) {
      return {
        error: true,
        message: 'Во время логина произошла ошибка. Попробуйте еще раз',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }
    }
  }

  async createSession({ user, IP, loginHeaders }: LoginUserCommand, refreshToken: string) {
    const deviceId = (+new Date()).toString()
    const loginIp = IP ?? loginHeaders['x-forwarded-for'] ?? 'IP undefined'

    const refreshTokenIssuedAt = this.jwtService.verify(refreshToken, {
      secret: this.appConfigService.refreshTokenSecret,
    })

    const sessionDTO: CreateSessionDTO = {
      loginIp,
      refreshTokenIssuedAt: refreshTokenIssuedAt.iat * 1000,
      userId: user.id,
      deviceId,
    }

    const resultCreation: boolean = await this.sessionRepo.createSessionInfo(sessionDTO)

    if (!resultCreation) throw new Error()
  }
}
