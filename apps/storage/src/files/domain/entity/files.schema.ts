import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { type HydratedDocument } from 'mongoose'

export type FileDocument = HydratedDocument<File>

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class File {
  @Prop({ required: true })
  referenceId!: string

  @Prop({ required: true })
  type!: string

  @Prop({ required: true })
  key!: string

  @Prop({ required: true })
  ETag!: string

  @Prop()
  createdAt!: Date

  @Prop()
  updatedAt!: Date
}

export const FileSchema = SchemaFactory.createForClass(File)
