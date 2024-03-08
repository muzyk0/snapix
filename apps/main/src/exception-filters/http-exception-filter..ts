import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common'
import { type Request, type Response } from 'express'
import { AuditLogServiceAbstract } from '@app/core/audit-log/audit-log-service.abstract'
import { AuditCode } from '@app/core/audit-log/dto/audit-log.entity'

@Catch(HttpException)
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  logger = new Logger(HttpExceptionFilter.name)
  constructor(private readonly auditLogService: AuditLogServiceAbstract) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()

    // todo: Refactor this duplicate code
    await this.auditLogService.create({
      code: AuditCode.HTTP_ERROR,
      message: exception.message,
      timestamp: new Date().toISOString(),

      extraData: JSON.stringify({
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

    this.logger.error(exception.message, exception.stack)

    // send the custom JSON response to the client
    response.status(status).json({
      message: exception.message,
      errors: exception.getResponse(),
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
