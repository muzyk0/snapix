import { Controller, Get } from '@nestjs/common'
import { MainService } from './main.service'
import { Public } from './features/auth'

@Controller()
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.mainService.getHello()
  }
}
