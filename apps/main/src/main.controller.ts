import { Controller, Get, Redirect } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'

@ApiExcludeController()
@Controller()
export class MainController {
  @Get()
  @Redirect('/', 302)
  redirectToHomePage(): void {}
}
