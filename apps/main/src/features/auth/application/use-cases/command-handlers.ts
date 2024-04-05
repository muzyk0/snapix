import { CreateUserHandler } from './create-user.handler'
import { ValidateUserHandler } from './validate-user.handler'
import { ConfirmRegisterHandler } from './confirm-register.handler'
import { ResendConfirmationTokenHandler } from './resend-confirmation-token.handler'
import { SendRecoveryPasswordTempCodeHandler } from './send-recovery-password-temp-code.handler'
import { ConfirmForgotPasswordHandler } from './confirm-forgot-password.handler'
import { LoginUserHandler } from './login-user.handler'
import { RefreshTokenHandler } from './refresh-token.handler'
import { LogoutHandler } from './logout.handler'
import { VerifyForgotPasswordTokenHandler } from './verify-forgot-password-token.handler'
import { CreateSessionHandler } from './create-session.handler'
import { LoginByExternalAccountHandler } from './login-by-external-account.handler'
import { ExchangeTokenHandler } from './exchange-token.handler'
import { GetMeHandler } from './get-me.query'

const queryHandler = [GetMeHandler]

export const CommandHandlers = [
  CreateUserHandler,
  ValidateUserHandler,
  ConfirmRegisterHandler,
  ResendConfirmationTokenHandler,
  SendRecoveryPasswordTempCodeHandler,
  ConfirmForgotPasswordHandler,
  LoginUserHandler,
  LogoutHandler,
  RefreshTokenHandler,
  VerifyForgotPasswordTokenHandler,
  CreateSessionHandler,
  LoginByExternalAccountHandler,
  ExchangeTokenHandler,
  ...queryHandler,
]
