import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { FilesController } from './files.controller'
import { handlers } from './application/use-cases/handlers'
import { IStorageAdapter } from './adapters/storage-adapter.abstract'
import { FilesStorageAdapter } from './adapters/files-storage.adapter'

@Module({
  imports: [CqrsModule],
  controllers: [FilesController],
  providers: [
    ...handlers,
    {
      provide: IStorageAdapter,
      useClass: FilesStorageAdapter,
    },
  ],
})
export class FilesModule {}
