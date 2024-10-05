import { Inject, Injectable } from '@nestjs/common'
import * as svgCaptcha from 'svg-captcha'
import { nanoid } from 'nanoid'
import { LoginDTO, CaptchaType } from './dto/login.dto'
import { PrismaClient } from '@prisma/client'
import { ConfigService } from '@nestjs/config'
import { R } from 'src/utils/error'
import { Request } from 'express'
import { getAdressByIp, getIp, getUserAgent } from 'src/utils/ip'
import { TokenVO } from './dto/token.dto'
import { RedisClientType } from 'redis'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RsaService } from 'src/services/rsa.service'
import { verify } from 'argon2'

@Injectable()
export class AuthService {
  // 保存验证码 生成和登录需要统一
  private checkCaptcha: CaptchaType
  constructor(
    private readonly prisma: PrismaClient,
    private readonly config: ConfigService,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType, // 注入 Redis 客户端
    private readonly RsaService: RsaService,
  ) {}

  // 生成验证码
  async genCaptcha(): Promise<CaptchaType> {
    const captcha = svgCaptcha.createMathExpr({
      width: 100,
      height: 38,
      color: true,
      mathMin: 1,
      mathMax: 9,
      mathOperator: '+',
    })
    this.checkCaptcha = Object.assign(captcha, {
      id: nanoid(),
      time: new Date(),
    })
    return this.checkCaptcha
  }

  // 登录
  async login(loginDTO: LoginDTO, req: Request): Promise<TokenVO> {
    const ip = getIp(req)
    const address = getAdressByIp(ip)
    const browser = getUserAgent(req).family
    const os = getUserAgent(req).os.toString()
    const { accountNumber } = loginDTO
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { userName: accountNumber },
          { email: accountNumber },
          { phoneNumber: accountNumber },
        ],
      },
    })

    if (!user) {
      throw R.error('账号或密码错误！') // 账号不存在
    }

    //获取私钥并且,把密码解密
    const password = await this.RsaService.decrypt(
      loginDTO.publicKey,
      loginDTO.password,
    )
    //删除私钥
    await this.redisClient.del(`publicKey:${loginDTO.publicKey}`)

    if (!password) {
      throw R.error('登陆出现异常,请重新登录')
    }
    loginDTO.password = password

    // 使用argon2验证密码
    if (!(await verify(user.password, loginDTO.password))) {
      throw R.error('密码错误')
    }
    if (loginDTO.captcha !== this.checkCaptcha.text) {
      throw R.error('验证码错误')
    }

    await this.prisma.login_Log.create({
      data: {
        ip,
        address,
        browser,
        os,
        userName: accountNumber,
        status: true,
        message: '登录成功',
      },
    })

    // 生成token
    const expire = this.config.get<number>('TOKEN_EXPIRE')
    const refreshExpire = this.config.get<number>('TOKEN_REFRESH_EXPIRE')

    const token = nanoid()
    const refreshToken = nanoid()

    // 存储token到redis
    await this.redisClient
      .multi()
      .set(`token:${token}`, JSON.stringify({ userId: user.id, refreshToken }))
      .expire(`token:${token}`, expire)
      .set(`refreshToken:${refreshToken}`, user.id)
      .expire(`refreshToken:${refreshToken}`, refreshExpire)
      .sAdd(`userToken_${user.id}`, token)
      .sAdd(`userRefreshToken_${user.id}`, refreshToken)
      .exec()

    return {
      expire,
      token,
      refreshExpire,
      refreshToken,
    } as TokenVO
  }
}
