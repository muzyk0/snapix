import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { type HydratedDocument, Document } from 'mongoose'

export type ImageResolutionsDocument = HydratedDocument<ImageResolutions>

@Schema()
class ImageResolutions extends Document {
  @Prop({ required: true })
  key!: string

  @Prop({ required: true })
  ETag!: string

  @Prop({ required: true })
  width!: number

  @Prop({ required: true })
  height!: number

  @Prop({ required: true })
  size!: number

  @Prop({ required: true })
  format!: string

  @Prop({ required: true })
  mimetype!: string

  @Prop()
  filename?: string
}
export const ImageResolutionsSchema = SchemaFactory.createForClass(ImageResolutions)

export type FileDocument = HydratedDocument<File>

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class File extends Document {
  @Prop({ required: true })
  referenceId!: string

  @Prop({ required: true })
  type!: string

  @Prop()
  createdAt!: Date

  @Prop()
  updatedAt!: Date

  @Prop({ type: ImageResolutionsSchema, default: [] })
  original!: ImageResolutions

  @Prop({ type: [ImageResolutionsSchema], default: [] })
  resolutions!: ImageResolutions[]
}

export const FileSchema = SchemaFactory.createForClass(File)
