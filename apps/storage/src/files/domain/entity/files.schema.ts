import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { type HydratedDocument } from 'mongoose'
import { randomUUID } from 'crypto'

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

  @Prop({ default: randomUUID() })
  id!: string

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
