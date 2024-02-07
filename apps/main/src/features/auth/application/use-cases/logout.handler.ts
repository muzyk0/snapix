import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { type JwtPayloadWithRt } from '../../types/jwt.type'
import { PrismaService } from '@app/prisma'

export class LogoutCommand {
  constructor(public readonly ctx: JwtPayloadWithRt) {}
}

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ ctx }: LogoutCommand): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.revokedToken.upsert({
        where: {
          userId: ctx.user.id,
          token: ctx.refreshToken,
        },
        create: {
          userId: ctx.user.id,
          token: ctx.refreshToken,
        },
        update: {},
      }),
      this.prisma.session.delete({
        where: {
          deviceId: ctx.deviceId,
        },
      }),
    ])
  }
}
