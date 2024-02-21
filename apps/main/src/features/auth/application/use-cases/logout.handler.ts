import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { type JwtPayloadWithRt } from '../../types/jwt.type'
import { SessionsRepo } from '../../infrastructure/sessions.repository'
import { RevokedTokenEntity } from '../../domain/entities/rovokedToken.entity'
import { IRevokedTokensRepository } from '../interfaces'

export class LogoutCommand {
  constructor(public readonly ctx: JwtPayloadWithRt) {}
}

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(
    private readonly revokedTokensRepository: IRevokedTokensRepository,
    private readonly sessionsRepo: SessionsRepo
  ) {}

  async execute({ ctx }: LogoutCommand): Promise<void> {
    await this.revokedTokensRepository.save(
      RevokedTokenEntity.createRevokedToken({
        userId: ctx.user.id,
        token: ctx.refreshToken,
      })
    )
    await this.sessionsRepo.deleteSession(ctx.deviceId)
  }
}
