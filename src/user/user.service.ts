import { Injectable } from '@nestjs/common'
import { UserDTO } from './dto/user.dto'
import { PrismaService } from 'src/services/prisma.service'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // 创建
  async create(user: UserDTO) {
    const result = await this.prisma.user.create({
      data: user,
    })
    return result
  }

  // 删除
  async remove(id: number) {
    const result = await this.prisma.user.delete({
      where: { id },
    })
    return result
  }

  // 修改
  async edit(user: UserDTO): Promise<UserDTO> {
    const result = await this.prisma.user.update({
      where: { id: user.id },
      data: user,
    })
    return result
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
