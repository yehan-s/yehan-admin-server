import { HttpException, HttpStatus } from '@nestjs/common'

export class R {
  // 服务器错误
  static error(message: string) {
    return new HttpException(message, HttpStatus.BAD_REQUEST)
  }

  // 参数错误
  static validateError(message: string) {
    return new HttpException(message, HttpStatus.UNPROCESSABLE_ENTITY)
  }

  // 未授权错误
  static unauthorizedError(message: string) {
    return new HttpException(message, HttpStatus.UNAUTHORIZED)
  }

  // 禁止错误
  static forbiddenError(message: string) {
    return new HttpException(message, HttpStatus.FORBIDDEN)
  }
}
