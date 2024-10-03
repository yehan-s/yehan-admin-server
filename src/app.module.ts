import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n'
import * as path from 'path'
// import { RedisModule } from './redis/redis.module'
import { LoggerService } from './services/logger.service'
import { UserModule } from './user/user.module'
import { PrismaService } from './services/prisma.service'

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
  providers: [LoggerService, PrismaService],
  exports: [LoggerService, PrismaService],
})
export class AppModule {}
