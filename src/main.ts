import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { LoggerService } from './services/logger.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 启用CORS
  app.enableCors()

  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe())

  app.useLogger(new LoggerService())

  // 启用swagger
  const config = new DocumentBuilder()
    .setTitle('Yehan Admin')
    .setDescription('yehan admin的后端接口')
    .setVersion('1.0')
    .addTag('yehan')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)

  console.log(`Swagger文档地址：http://localhost:${process.env.PORT}/swagger`)

  // 监听端口
  await app.listen(process.env.PORT || 3000)
}
bootstrap()
