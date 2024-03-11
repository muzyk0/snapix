import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { type UploadPhotoToPostParams } from '../../../../core/adapters/storage-adapter.abstract'
import { type UploadPhotoToPostViewDto } from '../../controllers/dto/upload-photo-to-post.dto'
import { IPostFilesFacade } from '../../service/post-files.facede'

export class UploadPhotoToPostCommand {
  constructor(readonly payload: UploadPhotoToPostParams) {}
}

@CommandHandler(UploadPhotoToPostCommand)
export class UploadPhotoToPostHandler implements ICommandHandler<UploadPhotoToPostCommand> {
  constructor(private readonly storage: IPostFilesFacade) {}

  async execute({ payload }: UploadPhotoToPostCommand): Promise<UploadPhotoToPostViewDto> {
    const imageFiles = await this.storage.uploadPhotoToPost(payload)

    return {
      photo: imageFiles,
    }
  }
}
