import { Test, type TestingModule } from '@nestjs/testing'
import { UsersApiController } from './users-api.controller'
import { UsersApiService } from './users-api.service'

describe('UsersApiController', () => {
  let usersApiController: UsersApiController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersApiController],
      providers: [UsersApiService],
    }).compile()

    usersApiController = app.get<UsersApiController>(UsersApiController)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(usersApiController.getHello()).toBe('Hello World!')
    })
  })
})
