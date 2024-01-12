import { Controller, Get, HttpStatus } from '@nestjs/common'
import { UsersQueryRepository } from '../infrastructure/users.query.repository'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Users')
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  @Get('/count-register-users')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the count of registered users.',
    type: Number,
  })
  async countRegisteredUsers() {
    return await this.usersQueryRepository.countRegisteredUsers()
  }
}
