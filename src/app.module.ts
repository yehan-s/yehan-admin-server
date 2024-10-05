import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n'
import * as path from 'path'
// import { RedisModule } from './redis/redis.module'
import { LoggerService } from './services/logger.service'
import { UserModule } from './modules/user/user.module'
import { PrismaService } from './services/prisma.service'
import { RsaService } from './services/rsa.service'
import { createClient } from 'redis'

const mode = process.env.NODE_ENV || 'development'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', `.env.${mode}`],
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'zh-CN',
      loaderOptions: {
        path: path.join(__dirname, '/../i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] }, // 从查询参数 'lang' 获取语言
        AcceptLanguageResolver, // 从 'Accept-Language' 请求头获取语言
      ],
    }),
    // RedisModule.registerAsync({}),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    LoggerService,
    PrismaService,
    RsaService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        })
        try {
          await client.connect()
        } catch (error) {
          console.error('Redis connection error:', error)
          throw error // 重新抛出错误，以便 Nest.js 处理
        }
        return client
      },
    },
  ],
  exports: [LoggerService, PrismaService, RsaService],
})
export class AppModule {}
