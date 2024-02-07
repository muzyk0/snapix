import { CreateUserHandler } from './create-user.handler'
import { ValidateUserHandler } from './validate-user.handler'
import { ConfirmRegisterHandler } from './confirm-register.handler'
import { ResendConfirmationTokenHandler } from './resend-confirmation-token.handler'
import { SendRecoveryPasswordTempCodeHandler } from './send-recovery-password-temp-code.handler'
import { ConfirmForgotPasswordHandler } from './confirm-forgot-password.handler'
import { LoginUserHandler } from './login-user.handler'
import { RefreshTokenHandler } from './refresh-token.handler'

export const CommandHandlers = [
  CreateUserHandler,
  ValidateUserHandler,
  ConfirmRegisterHandler,
  ResendConfirmationTokenHandler,
  SendRecoveryPasswordTempCodeHandler,
  ConfirmForgotPasswordHandler,
  LoginUserHandler,
  RefreshTokenHandler,
]
