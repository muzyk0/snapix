import { Test, TestingModule } from '@nestjs/testing';
import { NotifierController } from './notifier.controller';
import { NotifierService } from './notifier.service';

describe('NotifierController', () => {
  let notifierController: NotifierController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotifierController],
      providers: [NotifierService],
    }).compile();

    notifierController = app.get<NotifierController>(NotifierController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(notifierController.getHello()).toBe('Hello World!');
    });
  });
});
