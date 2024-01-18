import { Controller } from '@nestjs/common'
import { NotifierService } from './notifier.service'
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices'

@Controller()
export class NotifierController {
  constructor(private readonly notifierService: NotifierService) {}

  @MessagePattern({ cmd: 'email-notification' })
  async sendTestEmail(@Payload() data: any, @Ctx() context: MqttContext): Promise<string> {
    console.log(data)
    console.log(context)

    return this.notifierService.getHello()
  }
}
