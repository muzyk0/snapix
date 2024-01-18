import { Module } from '@nestjs/common';
import { NotifierController } from './notifier.controller';
import { NotifierService } from './notifier.service';

@Module({
  imports: [],
  controllers: [NotifierController],
  providers: [NotifierService],
})
export class NotifierModule {}
