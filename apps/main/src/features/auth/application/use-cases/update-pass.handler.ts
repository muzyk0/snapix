import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { UsersQueryRepository } from '../../../users/infrastructure/users.query.repository'
import { RecoveryConfirmationRepository } from '../../infrastructure/recovery-confirmation.repository'

export class UpdatePasswordCommand {
  constructor(
    public readonly password: string,
    public readonly recoveryCode: string
  ) {}
}

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordHandler implements ICommandHandler<UpdatePasswordCommand> {
  constructor(
    private readonly usersQueryRepo: UsersQueryRepository,
    private readonly recoveryConfirmationRepository: RecoveryConfirmationRepository
  ) {}

  async execute(command: UpdatePasswordCommand): Promise<any> {

    const foundCode =

  }
}
