import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 启用CORS
  app.enableCors()
  // 监听端口
  await app.listen(process.env.PORT || 3000)
}
bootstrap()
