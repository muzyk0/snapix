import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { type UploadPhotoForPostViewDto } from '../../controllers/dto/upload-photo-to-post.dto'
import { IPostFilesFacade } from '../../service/post-files.facede'
import { type UploadPhotoForPostDto } from '../dto/upload-photo-for-post.dto'
import { randomUUID } from 'crypto'

export class UploadPhotoToPostCommand {
  constructor(readonly payload: UploadPhotoForPostDto) {}
}

@CommandHandler(UploadPhotoToPostCommand)
export class UploadPhotoToPostHandler implements ICommandHandler<UploadPhotoToPostCommand> {
  constructor(private readonly storage: IPostFilesFacade) {}

  async execute({ payload }: UploadPhotoToPostCommand): Promise<UploadPhotoForPostViewDto> {
    const referenceId = randomUUID()
    const imageFiles = await this.storage.uploadPhotoToPost({
      referenceId,
      buffer: payload.buffer,
      mimetype: payload.mimetype,
      originalname: payload.originalname,
    })

    return {
      id: referenceId,
      files: imageFiles.files,
    }
  }
}
