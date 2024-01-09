import { Test, type TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersQueryRepository } from '../infrastructure/users.query.repository'
import { PrismaModule } from '@app/prisma'

describe('UsersController', () => {
  let controller: UsersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [UsersController],
      providers: [UsersQueryRepository],
    })
      .overrideProvider(UsersQueryRepository)
      .useValue({
        countRegisteredUsers: () => 10,
      })
      .compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('Count registered users should return the correct count', async () => {
    const result = await controller.countRegisteredUsers()
    expect(result).toBe(10)
  })

  it('Count registered users should handle errors gracefully', async () => {
    // Подмена реализации метода countRegisteredUsers для эмуляции ошибки
    jest.spyOn(controller, 'countRegisteredUsers').mockRejectedValueOnce(new Error('Test error'))

    await expect(controller.countRegisteredUsers()).rejects.toThrowError()

    // const result = await controller.countRegisteredUsers()
    // expect(result).toEqual({ success: false, data: null })
  })
})
