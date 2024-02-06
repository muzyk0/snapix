import { BadRequestException, UnauthorizedException } from '@nestjs/common'
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '@app/prisma'
import { isNil } from 'lodash'
import { type DecodedJwtRtPayload, type JwtPayloadWithRt } from '../../types/jwt.type'
import { type TokensType } from '../../types/tokens.type'
import { JwtService } from '../services/jwt.service'
import { SessionsRepo } from '../../infrastructure/sessions.repository'
import { isAfter } from 'date-fns'

export class RefreshTokenCommand {
  constructor(
    public readonly ctx: JwtPayloadWithRt,
    public readonly ip?: string
  ) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly sessionsRepo: SessionsRepo
  ) {}

  async execute({ ctx, ip }: RefreshTokenCommand): Promise<TokensType | null> {
    const isRevokedBefore = await this.prisma.revokedToken.findUnique({
      where: {
        userId: ctx.user.id,
        token: ctx.refreshToken,
      },
    })

    if (isNil(isRevokedBefore)) {
      throw new UnauthorizedException()
    }

    await this.prisma.revokedToken.create({
      data: {
        token: ctx.refreshToken,
        userId: ctx.user.id,
      },
    })

    const lastPasswordChange = await this.prisma.passwordHistory.findFirst({
      where: {
        userId: ctx.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (
      !isNil(lastPasswordChange) &&
      !isNil(lastPasswordChange.createdAt) &&
      isAfter(lastPasswordChange.createdAt, new Date())
    ) {
      throw new BadRequestException({
        password: {
          message: 'Password is expired',
          property: 'password',
        },
      })
    }

    const tokens = await this.jwtService.createJwtTokens(
      {
        user: ctx.user,
      },
      {
        user: ctx.user,
        deviceId: ctx.deviceId,
      }
    )

    const decodedRefreshToken = await this.jwtService.decodeJwtToken<DecodedJwtRtPayload>(
      tokens.refreshToken
    )

    if (isNil(decodedRefreshToken)) {
      return null
    }

    await this.sessionsRepo.upsertSessionInfo({
      userIp: ip,
      refreshTokenIssuedAt: decodedRefreshToken.iat,
      refreshTokenExpireAt: decodedRefreshToken.exp,
      userId: decodedRefreshToken.user.id,
      deviceId: decodedRefreshToken.deviceId,
    })

    return tokens
  }
}
