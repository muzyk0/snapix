import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { type HydratedDocument } from 'mongoose'

export type FileDocument = HydratedDocument<File>

@Schema()
export class File {
  @Prop({ required: true })
  ownerId!: string

  @Prop({ required: true })
  type!: string

  @Prop({ required: true })
  key!: string

  @Prop({ required: true })
  ETag!: string
}

export const FileSchema = SchemaFactory.createForClass(File)
