import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PrismaClient } from '@prisma/client'
import { RsaService } from 'src/services/rsa.service'
import { createClient } from 'redis'

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaClient,
    RsaService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: 'localhost',
            port: 6379,
          },
          password: 'example',
        })
        try {
          await client.connect()
        } catch (error) {
          console.error('Redis 连接失败:')
          throw error // 重新抛出错误，以便 Nest.js 处理
        }
        return client
      },
    },
  ],
})
export class AuthModule {}
