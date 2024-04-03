import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common'

/** ValidationPipe используется для валидации загружаемых файлов */
export const ImagesValidationPipe = () =>
  new ParseFilePipeBuilder()
    .addMaxSizeValidator({
      maxSize: 1024 * 1024 * 10,
    })
    .addFileTypeValidator({
      fileType: ['jpeg', 'png'].join('|'),
    })
    .build({
      // todo: Implement exceptionFactory
      fileIsRequired: true,
      errorHttpStatusCode: HttpStatus.PAYLOAD_TOO_LARGE,
    })
