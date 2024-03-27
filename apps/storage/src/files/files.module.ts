import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { FilesController } from './controllers/files.controller'
import { handlers } from './application/use-cases/handlers'
import { IStorageAdapter } from './adapters/storage-adapter.abstract'
import { FilesStorageAdapter } from './adapters/files-storage.adapter'
import { ScheduleModule } from '@nestjs/schedule'
import { MongooseModule } from '@nestjs/mongoose'
import { models } from './domain/entity'
import { SharpService } from './application/services/sharp.service'

@Module({
  imports: [CqrsModule, ScheduleModule.forRoot(), MongooseModule.forFeature(models)],
  controllers: [FilesController],
  providers: [
    ...handlers,
    {
      provide: IStorageAdapter,
      useClass: FilesStorageAdapter,
    },
    SharpService,
  ],
})
export class FilesModule {}
