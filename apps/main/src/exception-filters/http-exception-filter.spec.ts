import { Test, type TestingModule } from '@nestjs/testing'
import { HttpException, HttpStatus } from '@nestjs/common'
import { AuditLogServiceAbstract } from '@app/core/audit-log/audit-log-service.abstract'
import { AuditCode } from '@app/core/audit-log/dto/audit-log.entity'
import { HttpExceptionFilter } from './http-exception-filter.'

// mock the audit log service
const mockAuditLogService = {
  create: jest.fn(),
} satisfies AuditLogServiceAbstract

// mock the response object
const mockJson = jest.fn()
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}))
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}))

// mock the request object
const mockGetRequest = jest.fn().mockImplementation(() => ({
  url: 'mock-url',
  method: 'mock-method',
  headers: 'mock-headers',
  body: 'mock-body',
  query: 'mock-query',
  params: 'mock-params',
}))

// mock the arguments host object
const mockArgumentsHost = {
  switchToHttp: jest.fn().mockImplementation(() => ({
    getResponse: mockGetResponse,
    getRequest: mockGetRequest,
  })),
}

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter

  beforeEach(async () => {
    // create a testing module with the filter and the mock service
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpExceptionFilter,
        {
          provide: AuditLogServiceAbstract,
          useValue: mockAuditLogService,
        },
      ],
    }).compile()

    // get the filter instance
    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter)
  })

  it('should catch and log the error', async () => {
    // create a mock exception
    const mockException = new HttpException('Mock error', HttpStatus.BAD_REQUEST)

    // call the filter's catch method with the mock exception and arguments host
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await filter.catch(mockException, mockArgumentsHost as never)

    // check if the audit log service's create method was called with the expected arguments
    expect(mockAuditLogService.create).toBeCalledWith({
      code: AuditCode.HTTP_ERROR,
      message: mockException.message,
      timestamp: expect.any(String),
      extraData: JSON.stringify({
        statusCode: mockException.getStatus(),
        path: mockGetRequest().url,
        method: mockGetRequest().method,
        headers: mockGetRequest().headers,
        body: mockGetRequest().body,
        query: mockGetRequest().query,
        params: mockGetRequest().params,
        stack: mockException.stack,
      }),
    })

    // check if the response's status and json methods were called with the expected arguments
    expect(mockStatus).toBeCalledWith(mockException.getStatus())
    expect(mockJson).toBeCalledWith({
      statusCode: mockException.getStatus(),
      message: mockException.message,
      timestamp: expect.any(String),
      path: mockGetRequest().url,
    })
  })
})
