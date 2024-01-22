import { Controller } from '@nestjs/common'

@Controller()
export class NotifierController {
  // constructor(private readonly notifierService: NotifierService) {}
  // @EventPattern({ cmd: 'email-notification' })
  // async sendTestEmail(@Payload() data: any, @Ctx() context: MqttContext): Promise<string> {
  //   console.log(data)
  //   console.log(context)
  //
  //   return this.notifierService.getHello()
  // }
}
