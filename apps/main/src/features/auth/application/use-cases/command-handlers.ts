import { CreateUserHandler } from './create-user.handler'
import { ValidateUserHandler } from './validate-user.handler'
import { ConfirmRegisterHandler } from './confirm-register.handler'
import { ResendConfirmationTokenHandler } from './resend-confirmation-token.handler'
import { SendRecoveryPasswordTempCodeHandler } from './send-recovery-password-temp-code.handler'

export const CommandHandlers = [
  CreateUserHandler,
  ValidateUserHandler,
  ConfirmRegisterHandler,
  ResendConfirmationTokenHandler,
  SendRecoveryPasswordTempCodeHandler,
]
