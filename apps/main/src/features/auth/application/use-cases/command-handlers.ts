import { CreateUserHandler } from './create-user.handler'
import { ValidateUserHandler } from './validate-user.handler'
import { LoginUserHandler } from './login-user.handler'
import { RecoveryPasswordHandler } from './recovery-pass.handler'

export const CommandHandlers = [
  CreateUserHandler,
  ValidateUserHandler,
  LoginUserHandler,
  RecoveryPasswordHandler,
]
