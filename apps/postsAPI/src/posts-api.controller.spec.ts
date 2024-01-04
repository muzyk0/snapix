import { Test, TestingModule } from '@nestjs/testing';
import { PostsApiController } from './posts-api.controller';
import { PostsApiService } from './posts-api.service';

describe('AppController', () => {
  let postsApiController: PostsApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PostsApiController],
      providers: [PostsApiService],
    }).compile();

    postsApiController = app.get<PostsApiController>(PostsApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(postsApiController.getHello()).toBe('Hello World!');
    });
  });
});
