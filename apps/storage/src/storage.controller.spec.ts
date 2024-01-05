import { Test, type TestingModule } from '@nestjs/testing'
import { StorageController } from './storage.controller'
import { StorageService } from './storage.service'

describe('StorageController', () => {
  let storageController: StorageController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StorageController],
      providers: [StorageService],
    }).compile()

    storageController = app.get<StorageController>(StorageController)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(storageController.getHello()).toBe('Hello World!')
    })
  })
})
