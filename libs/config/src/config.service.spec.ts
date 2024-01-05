import { Test, type TestingModule } from '@nestjs/testing'
import { AppConfigService } from './app-config.service'
import { ConfigService } from '@nestjs/config'

describe('ConfigService', () => {
  let service: AppConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppConfigService, ConfigService],
    }).compile()

    service = module.get<AppConfigService>(AppConfigService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
