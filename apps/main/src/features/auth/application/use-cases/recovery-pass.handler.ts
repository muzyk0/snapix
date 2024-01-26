import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { HttpStatus } from '@nestjs/common'
import { NotificationService } from '../../../notification/services/notification.service'
import { UsersQueryRepository } from '../../../users/infrastructure/users.query.repository'
import { randomUUID } from 'crypto'
import { addDays } from 'date-fns'
import { RecoveryConfirmationRepository } from '../../infrastructure/recovery-confirmation.repository'

export class RecoveryPasswordCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(RecoveryPasswordCommand)
export class RecoveryPasswordHandler implements ICommandHandler<RecoveryPasswordCommand> {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly usersQueryRepo: UsersQueryRepository,
    private readonly recoveryConfirmationRepository: RecoveryConfirmationRepository
  ) {}

  async execute(command: RecoveryPasswordCommand): Promise<any> {
    try {
      const foundUser = await this.usersQueryRepo.findUserByEmail(command.email)

      if (foundUser === null) {
        return {
          error: true,
          message: "User with this email doesn't exist",
          status: HttpStatus.BAD_REQUEST,
        }
      }
      const passwordRecoveryCode = randomUUID()
      const expDate = addDays(new Date(), 1)

      const result = await this.recoveryConfirmationRepository.createPasswordRecoveryCode(
        foundUser.id,
        passwordRecoveryCode,
        expDate
      )

      if (!result) {
        return {
          error: true,
          message: 'Error occurred during recovery code creation',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        }
      }

      // Тут идет отправка письма
      ///
      ///
      ///

      return {
        error: false,
        message: 'We have sent a link to confirm your email to ____email_____',
      }
    } catch (e) {
      return {
        error: true,
        message: 'Во время логина произошла ошибка. Попробуйте еще раз',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }
    }
  }
}
