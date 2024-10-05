import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiOperation } from '@nestjs/swagger'
import { LoginDTO } from './dto/login.dto'
import { Request } from 'express'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RsaService } from 'src/services/rsa.service'

@Controller('auth')
export class AuthController {
  // private rsa: RsaService
  constructor(
    private readonly authService: AuthService,
    private readonly RsaService: RsaService,
  ) {}

  @Get('/login')
  async login() {
    return {
      message: 'login success',
      name: 'yehan',
      age: 23,
    }
  }

  @ApiOperation({ summary: '获取验证码' })
  @Get('/captcha')
  async getImageCaptcha() {
    const data = await this.authService.genCaptcha()
    return data
  }

  @ApiOperation({ summary: '登录' })
  @Post('/login')
  async loginB(@Body() body: LoginDTO, @Req() req: Request) {
    return this.authService.login(body, req)
  }

  @ApiOperation({ summary: '获取公钥' })
  @Get('/publicKey')
  async getPublicKey() {
    return this.RsaService.getPublicKey()
  }
}
