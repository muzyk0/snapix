import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { JwtService } from '@nestjs/jwt'
import { type User } from '@prisma/client'
import { InternalServerErrorException } from '@nestjs/common'
import { type DecodedJwtRTPayload, type JwtAtPayload } from '../../types/jwt-at-payload'
import { type CreateSessionType } from '../../types/create-session.type'
import { SessionsRepo } from '../../infrastructure/sessions.repository'
import { AppConfigService } from '@app/config'
import { type TokensType } from '../../types/tokens.type'

export class LoginUserCommand {
  constructor(
    public readonly user: User,
    public readonly ip: string
  ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
    private readonly sessionRepo: SessionsRepo
  ) {}

  async execute(command: LoginUserCommand): Promise<TokensType> {
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

      return { accessToken, refreshToken }
    } catch (e) {
      throw new InternalServerErrorException(
        'The email or password are incorrect. Try again please'
      )
    }
  }

  async createSession({ user, ip }: LoginUserCommand, refreshToken: string) {
    const deviceId = (+new Date()).toString()

    const decodedRefreshToken: DecodedJwtRTPayload = this.jwtService.verify(refreshToken, {
      secret: this.appConfigService.refreshTokenSecret,
    })

    const sessionDTO: CreateSessionType = {
      userIp: ip,
      refreshTokenIssuedAt: decodedRefreshToken.iat,
      refreshTokenExpireAt: decodedRefreshToken.exp,
      userId: user.id,
      deviceId,
    }

    const resultCreation: boolean = await this.sessionRepo.createSessionInfo(sessionDTO)

    if (!resultCreation) {
      throw new Error()
    }
  }
}
