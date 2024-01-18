import { Injectable } from '@nestjs/common'

@Injectable()
export class NotificationService {
  async sendEmailConfirmationCode(_data: any): Promise<void> {}
}
