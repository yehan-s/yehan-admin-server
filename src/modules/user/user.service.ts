import { Injectable } from '@nestjs/common'
import { UserDTO } from '../user/dto/user.dto'
import { PrismaService } from 'src/services/prisma.service'
import { R } from 'src/utils/error'
import { hash } from 'argon2'
import { UserVO } from '../user/dto/user-vo.dto'
import { omit } from 'lodash'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // 创建
  async create(userDTO: UserDTO) {
    const { userName, phoneNumber, email } = userDTO
    let user = await this.prisma.user.findFirst({ where: { userName } })
    if (user) {
      throw R.validateError('用户名已存在')
    }

    user = await this.prisma.user.findFirst({ where: { phoneNumber } })
    if (user) {
      throw R.validateError('手机号已存在')
    }

    user = await this.prisma.user.findFirst({ where: { email } })
    if (user) {
      throw R.validateError('邮箱已存在')
    }

    // 默认密码123456，并进行加盐处理
    let password = ''
    if (userDTO.password) {
      password = await hash(userDTO.password)
    } else {
      password = await hash('123456')
    }

    userDTO.password = password
    const result = await this.prisma.user.create({ data: userDTO })
    return omit(result, ['password']) as UserVO
  }

  // 删除
  async remove(id: string) {
    const result = await this.prisma.user.delete({
      where: { id },
    })
    return result
  }

  // 修改
  async edit(userDTO: UserDTO): Promise<UserVO> {
    const { userName, phoneNumber, email, id } = userDTO

    let user = await this.prisma.user.findFirst({ where: { userName } })
    if (user && user.id !== id) {
      R.validateError('用户名已存在')
    }

    user = await this.prisma.user.findFirst({ where: { phoneNumber } })
    if (user && user.id !== id) {
      R.validateError('手机号已存在')
    }
    user = await this.prisma.user.findFirst({ where: { email } })
    if (user && user.id !== id) {
      R.validateError('邮箱已存在')
    }

    const result = await this.prisma.user.update({
      where: { id: user.id },
      data: user,
    })
    return omit(result, ['password']) as UserVO
  }

  // 分页查询
  async page(page: number, pageSize: number, where?: any) {
    const data = await this.prisma.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        create_date: 'desc',
      },
      where,
    })
    const total = await this.prisma.user.count({ where })
    return { data, total }
  }

  // 根据查询条件返回全部
  async list(where?: any) {
    const data = await this.prisma.user.findMany({
      orderBy: {
        create_date: 'desc',
      },
      where,
    })

    return data
  }
}
