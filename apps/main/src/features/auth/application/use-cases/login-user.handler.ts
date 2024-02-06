import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { InternalServerErrorException } from '@nestjs/common'
import { type DecodedJwtRtPayload, type JwtAtPayload } from '../../types/jwt.type'
import { type CreateSessionType } from '../../types/create-session.type'
import { SessionsRepo } from '../../infrastructure/sessions.repository'
import { type TokensType } from '../../types/tokens.type'
import { JwtService } from '../services/jwt.service'
import { randomUUID } from 'crypto'
import { isNil } from 'lodash'
import { PrismaService } from '@app/prisma'

export class LoginUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly ip?: string
  ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionRepo: SessionsRepo,
    private readonly prisma: PrismaService
  ) {}

  async execute(command: LoginUserCommand): Promise<TokensType> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          email: command.email,
        },
      })

      const jwtPayload: JwtAtPayload = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      }

      const deviceId = randomUUID()

      const { accessToken, refreshToken } = await this.jwtService.createJwtTokens(jwtPayload, {
        ...jwtPayload,
        deviceId,
      })

      await this.createSession({
        userId: user.id,
        ip: command.ip,
        refreshToken,
        deviceId,
      })

      return { accessToken, refreshToken }
    } catch (e) {
      throw new InternalServerErrorException('Some error occurred. Please try again later.')
    }
  }

  async createSession({
    ip,
    userId,
    refreshToken,
    deviceId,
  }: {
    userId: number
    ip?: string
    refreshToken: string
    deviceId: string
  }) {
    const decodedRefreshToken: DecodedJwtRtPayload | null =
      await this.jwtService.decodeJwtToken(refreshToken)

    if (isNil(decodedRefreshToken)) {
      throw new Error()
    }

    const sessionDTO: CreateSessionType = {
      userIp: ip,
      refreshTokenIssuedAt: decodedRefreshToken.iat,
      refreshTokenExpireAt: decodedRefreshToken.exp,
      userId,
      deviceId,
    }

    const resultCreation: boolean = await this.sessionRepo.createSessionInfo(sessionDTO)

    if (!resultCreation) {
      throw new Error()
    }
  }
}
