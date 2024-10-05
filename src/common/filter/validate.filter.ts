import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import { Response } from 'express'
import { LoggerService } from 'src/services/logger.service'

@Catch(HttpException)
export class ValidateExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    // console.log('进入过滤器')
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    // 自定义异常处理

    // 为了获取上下文传入日志
    const exceptionResponse = exception.getResponse()
    const errorMessage =
      exceptionResponse instanceof Object
        ? JSON.stringify(exceptionResponse)
        : exceptionResponse
    const context = request.url // 假设上下文是请求的 URL

    this.loggerService.error(errorMessage, context)

    if (exception instanceof BadRequestException) {
      return response.json(exception.getResponse())
      // throw new HttpException(exception.getResponse(), HttpStatus.BAD_REQUEST, )
    }

    return response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
