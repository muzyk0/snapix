import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { MeViewDto } from '../../application/dto/me-view.dto'

export function ApiGetMe() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get information about current user',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns information about current user',
      type: MeViewDto,
    })
  )
}
