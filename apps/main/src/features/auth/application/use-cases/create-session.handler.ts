import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { type DecodedJwtRtPayload, type JwtAtPayload } from '../../types/jwt.type'
import { type CreateSessionType } from '../../types/create-session.type'
import { SessionsRepo } from '../../infrastructure/sessions.repository'
import { type TokensType } from '../../types/tokens.type'
import { JwtService } from '../services/jwt.service'
import { randomUUID } from 'crypto'
import { isNil } from 'lodash'
import { PrismaService } from '@app/prisma'

export class CreateSessionCommand {
  constructor(
    public readonly userId: number,
    public readonly userAgent?: string,
    public readonly ip?: string
  ) {}
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionHandler implements ICommandHandler<CreateSessionCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionRepo: SessionsRepo,
    private readonly prisma: PrismaService
  ) {}

  async execute({ userId, userAgent, ip }: CreateSessionCommand): Promise<TokensType> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
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
      ip,
      refreshToken,
      deviceId,
      deviceName: userAgent,
    })

    return { accessToken, refreshToken }
  }

  async createSession({
    ip,
    userId,
    refreshToken,
    deviceId,
    deviceName,
  }: {
    userId: number
    ip?: string
    refreshToken: string
    deviceId: string
    deviceName?: string
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
      deviceName,
    }

    const resultCreation: boolean = await this.sessionRepo.createSessionInfo(sessionDTO)

    if (!resultCreation) {
      throw new Error()
    }
  }
}
