import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { type UploadPhotoForPostViewDto } from '../../controllers/dto/upload-photo-to-post.dto'
import { type UploadPhotoForPostDto } from '../dto/upload-photo-for-post.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { UploadPostImageEvent } from '../../domain/events/upload-post-image.event'
import { IImageFilesFacade } from '../../../../core/adapters/storage/user-files.facede'
import { StorageFileTypeEnum } from '@app/core/enums/storage-command.enum'

export class UploadPhotoToPostCommand {
  constructor(
    readonly userId: number,
    readonly payload: UploadPhotoForPostDto
  ) {}
}

@CommandHandler(UploadPhotoToPostCommand)
export class UploadPhotoToPostHandler implements ICommandHandler<UploadPhotoToPostCommand> {
  constructor(
    private readonly storage: IImageFilesFacade,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async execute({ userId, payload }: UploadPhotoToPostCommand): Promise<UploadPhotoForPostViewDto> {
    const imageFiles = await this.storage.uploadImage({
      ownerId: String(userId),
      type: StorageFileTypeEnum.POST,
      resolutions: [
        {
          width: 48,
          height: 48,
        },
        {
          width: 192,
          height: 192,
        },
        {
          width: 512,
          height: 512,
        },
      ],
      file: {
        buffer: payload.buffer,
        mimetype: payload.mimetype,
        originalname: payload.originalname,
      },
    })

    this.eventEmitter.emit('post.photo.uploaded', new UploadPostImageEvent(imageFiles.referenceId))

    return {
      id: imageFiles.referenceId,
      files: imageFiles.files,
    }
  }
}
