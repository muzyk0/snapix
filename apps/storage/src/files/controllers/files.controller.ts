import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { UploadImageDto } from '@app/core/types/dto/upload-image.dto'
import type { UploadFilesOutputDto } from '@app/core/types/dto/upload-files.dto'
import { DeleteAvatarFileCommand, GetFileQuery, UploadImageCommand } from '../application/use-cases'
import { StorageCommandEnum } from '@app/core/enums/storage-command.enum'
import { GetFilesQuery } from '../application/use-cases/get-files.handler'

@Controller('files')
export class FilesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @MessagePattern({ cmd: 'get-file', type: StorageCommandEnum.IMAGE })
  async getImage(referenceId: string): Promise<UploadFilesOutputDto> {
    return await this.queryBus.execute<GetFileQuery, UploadFilesOutputDto>(
      new GetFileQuery(referenceId)
    )
  }

  @MessagePattern({ cmd: 'get-files', type: StorageCommandEnum.IMAGE })
  async getImages(referenceIds: string[]): Promise<UploadFilesOutputDto> {
    return await this.queryBus.execute<GetFilesQuery, UploadFilesOutputDto>(
      new GetFilesQuery(referenceIds)
    )
  }

  @MessagePattern({ cmd: 'upload-file', type: StorageCommandEnum.IMAGE })
  async uploadImage(payload: UploadImageDto): Promise<UploadFilesOutputDto> {
    const { referenceId } = await this.commandBus.execute<
      UploadImageCommand,
      Pick<UploadFilesOutputDto, 'referenceId'>
    >(
      new UploadImageCommand({
        ...payload,
        file: {
          ...payload.file,
          // fixme: This this object {type: 'Buffer', data: number[]}
          buffer: Buffer.from(payload.file.buffer),
        },
      })
    )

    return await this.queryBus.execute<GetFileQuery, UploadFilesOutputDto>(
      new GetFileQuery(referenceId)
    )
  }

  @MessagePattern({ cmd: 'delete-file', type: StorageCommandEnum.IMAGE })
  async deleteImage(ownerId: string): Promise<boolean> {
    await this.commandBus.execute<DeleteAvatarFileCommand, undefined>(
      new DeleteAvatarFileCommand(ownerId)
    )

    return true
  }
}
