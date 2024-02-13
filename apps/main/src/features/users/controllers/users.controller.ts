import { Controller, Get, HttpStatus } from '@nestjs/common'
import { UsersQueryRepository } from '../infrastructure/users.query.repository'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
// fixme: circular dependency
import { Public } from '../../auth/guards/public.guard'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the count of registered users.',
    type: Number,
  })
  @Public()
  @Get('/count-register-users')
  async countRegisteredUsers() {
    return await this.usersQueryRepository.countRegisteredUsers()
  }
}
