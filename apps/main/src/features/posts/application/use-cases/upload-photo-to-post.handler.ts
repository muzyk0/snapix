import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { type UploadPhotoForPostViewDto } from '../../controllers/dto/upload-photo-to-post.dto'
import { IPostFilesFacade } from '../../service/post-files.facede'
import { type UploadPhotoForPostDto } from '../dto/upload-photo-for-post.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { UploadPostImageEvent } from '../../domain/events/upload-post-image.event'

export class UploadPhotoToPostCommand {
  constructor(
    readonly userId: number,
    readonly payload: UploadPhotoForPostDto
  ) {}
}

@CommandHandler(UploadPhotoToPostCommand)
export class UploadPhotoToPostHandler implements ICommandHandler<UploadPhotoToPostCommand> {
  constructor(
    private readonly storage: IPostFilesFacade,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async execute({ userId, payload }: UploadPhotoToPostCommand): Promise<UploadPhotoForPostViewDto> {
    const imageFiles = await this.storage.uploadPhotoToPost({
      ownerId: String(userId),
      buffer: payload.buffer,
      mimetype: payload.mimetype,
      originalname: payload.originalname,
    })

    this.eventEmitter.emit('post.photo.uploaded', new UploadPostImageEvent(imageFiles.referenceId))

    return {
      id: imageFiles.referenceId,
      files: imageFiles.files,
    }
  }
}
