import { Injectable } from '@nestjs/common'
// import * as chalk from 'chalk'
import * as dayjs from 'dayjs'
import { createLogger, format, Logger, transports } from 'winston'

@Injectable()
export class LoggerService {
  private logger: Logger

  constructor() {
    this.logger = createLogger({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, level, message, time }) => {
              const appStr = '[NEST]'
              const contextStr = `[${context}]`

              return `${appStr} ${time} ${level} ${contextStr} ${message} `
            }),
          ),
        }),
        new transports.File({
          format: format.combine(format.timestamp(), format.json()),
          filename: `log-${dayjs().format('YYYY-MM-DD')}.log`,
          dirname: 'logs',
        }),
      ],
    })
  }

  log(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')

    this.logger.log('info', message, { context, time })
  }

  error(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')

    this.logger.log('error', message, { context, time })
  }

  warn(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')

    this.logger.log('warn', message, { context, time })
  }
}
