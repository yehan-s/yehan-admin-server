import { ConfigService } from '@nestjs/config'
import { RedisOptions } from 'ioredis'

export const redisConfig = {
  provide: 'REDIS_OPTION_TOKEN',
  useFactory: async (configService: ConfigService) => {
    return {
      host: configService.get<string>('redis.host'),
      port: configService.get<number>('redis.port'),
      // ...其他 Redis 配置项
    } as RedisOptions
  },
  inject: [ConfigService],
}
