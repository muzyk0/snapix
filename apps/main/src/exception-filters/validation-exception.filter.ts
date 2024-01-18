import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  type HttpException,
  Injectable,
} from '@nestjs/common'
import { ValidationException } from '../setup-app'
import { AuditLogServiceAbstract } from '@app/core/audit-log/audit-log-service.abstract'
import { type Request, type Response } from 'express'
import { type ValidationError } from 'class-validator'
import { AuditCode } from '@app/core/audit-log/dto/audit-log.entity'
import { ErrorMapper } from './utils/error-mapper'

@Catch(ValidationException)
@Injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(private readonly auditLogService: AuditLogServiceAbstract) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()

    const validatorErrors = (
      exception.getResponse() as {
        message: ValidationError[]
      }
    ).message

    const validationErrors =
      ErrorMapper.mapValidationErrorsToValidationExceptionFilter(validatorErrors)

    // todo: Refactor this duplicate code
    await this.auditLogService.create({
      code: AuditCode.VALIDATION_ERROR,
      message: exception.message,
      timestamp: new Date().toISOString(),

      extraData: JSON.stringify({
        validationError: validationErrors,
        statusCode: status,
        path: request.url,
        method: request.method,
        headers: request.headers,
        body: request.body,
        query: request.query,
        params: request.params,
        stack: exception.stack,
      }),
    })

    // send the custom JSON response to the client
    response.status(status).json({
      message: exception.message,
      errors: validationErrors,
    })
  }
}
