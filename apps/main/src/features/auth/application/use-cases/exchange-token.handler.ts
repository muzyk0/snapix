import { CommandBus, CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { type DecodedJwtRtPayload } from '../../types/jwt.type'
import { type TokensType } from '../../types/tokens.type'
import { JwtService } from '../services/jwt.service'
import { RefreshTokenCommand } from './refresh-token.handler'
import { BadRequestException } from '@nestjs/common'

export class ExchangeTokenCommand {
  constructor(
    public readonly token: string,
    // public readonly ctx: JwtPayloadWithRt,
    public readonly ip?: string
  ) {}
}

@CommandHandler(ExchangeTokenCommand)
export class ExchangeTokenHandler implements ICommandHandler<ExchangeTokenCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly commandBus: CommandBus
  ) {}

  async execute({ token, ip }: ExchangeTokenCommand): Promise<TokensType | null> {
    const ctx = await this.jwtService.decodeJwtToken<DecodedJwtRtPayload>(token)

    if (!ctx) {
      throw new BadRequestException()
    }

    return this.commandBus.execute<RefreshTokenCommand, TokensType | null>(
      new RefreshTokenCommand(
        {
          user: ctx.user,
          deviceId: ctx.deviceId,
          refreshToken: token,
        },
        ip
      )
    )
  }
}
