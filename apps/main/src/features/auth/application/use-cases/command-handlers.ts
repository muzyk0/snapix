import { CreateUserHandler } from './create-user.handler'
import { ValidateUserHandler } from './validate-user.handler'
import { ConfirmRegisterHandler } from './confirm-register.handler'
import { LoginUserHandler } from './login-user.handler'

export const CommandHandlers = [CreateUserHandler, ValidateUserHandler, ConfirmRegisterHandler, LoginUserHandler]
