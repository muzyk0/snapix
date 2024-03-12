import { IsNotEmpty, IsString } from 'class-validator'

export class UploadFileDto {
  // TODO: Не нравится, что id мне (сервису) предоставляет какой то другой сервис и я обязан сохранять по этому i
  //  Подумать над генерацией id на стороне storage сервиса и отдавать его клиенту.
  @IsString()
  referenceId!: string

  @IsNotEmpty()
  buffer!: Buffer

  @IsString()
  mimetype!: string

  @IsString()
  originalname!: string
}
