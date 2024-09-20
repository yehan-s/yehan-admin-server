import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

const mode = process.env.NODE_ENV || 'development'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [, `.env.${mode}`, '.env'],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
