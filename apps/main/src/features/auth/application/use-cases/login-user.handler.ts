import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { JwtService } from '@nestjs/jwt'
import { type User } from '@prisma/client'
import { ConfigService } from '@nestjs/config'
import { HttpStatus } from '@nestjs/common'
import { type JwtAtPayload } from '../../types/jwt-at-payload'
import { type LoginHeaders } from '../../types/login-headers'
import { type createSessionDTO } from '../../types/create-session-dto-type'
import { SessionsRepo } from '../../infrastructure/sessions.repository'

export class LoginUserCommand {
  constructor(
    public readonly user: User,
    public readonly IP: string,
    public readonly loginHeaders: LoginHeaders
  ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  private readonly ACCESS_TOKEN_SECRET: string
  private readonly ACCESS_TOKEN_SECRET_EXPIRES_IN: string
  private readonly REFRESH_TOKEN_SECRET: string
  private readonly REFRESH_TOKEN_SECRET_EXPIRES_IN: string
  constructor(
    private readonly jwtService: JwtService,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    private readonly configService: ConfigService,
    private readonly sessionRepo: SessionsRepo
  ) {
    this.ACCESS_TOKEN_SECRET = configService.getOrThrow('ACCESS_TOKEN_SECRET')
    this.ACCESS_TOKEN_SECRET_EXPIRES_IN = configService.getOrThrow('ACCESS_TOKEN_SECRET_EXPIRES_IN')
    this.REFRESH_TOKEN_SECRET = configService.getOrThrow('REFRESH_TOKEN_SECRET')
    this.REFRESH_TOKEN_SECRET_EXPIRES_IN = configService.getOrThrow(
      'REFRESH_TOKEN_SECRET_EXPIRES_IN'
    )
  }

  async execute(command: LoginUserCommand): Promise<any> {
    try {
      const { user } = command

      const jwtPayload: JwtAtPayload = {
        user: {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        },
      }

      const accessToken = await this.jwtService.signAsync(jwtPayload, {
        secret: this.ACCESS_TOKEN_SECRET,
        expiresIn: this.ACCESS_TOKEN_SECRET_EXPIRES_IN,
      })

      const refreshToken = await this.jwtService.signAsync(jwtPayload, {
        secret: this.REFRESH_TOKEN_SECRET,
        expiresIn: this.REFRESH_TOKEN_SECRET_EXPIRES_IN,
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
      secret: this.REFRESH_TOKEN_SECRET,
    })

    const sessionDTO: createSessionDTO = {
      loginIp,
      refreshTokenIssuedAt: refreshTokenIssuedAt.iat * 1000,
      userId: user.id,
      deviceId,
    }

    const resultCreation: boolean = await this.sessionRepo.createSessionInfo(sessionDTO)

    if (!resultCreation) throw new Error()
  }
}
