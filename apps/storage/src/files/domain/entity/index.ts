import { type ModelDefinition } from '@nestjs/mongoose/dist/interfaces'
import { File, FileSchema } from './files.schema'

export const models: ModelDefinition[] = [{ name: File.name, schema: FileSchema }]
