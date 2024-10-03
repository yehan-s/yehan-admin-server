import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { UserDTO } from './dto/user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  async create(@Body() data: UserDTO) {
    return this.userService.create(data)
  }

  @Put('/')
  async edit(@Body() data: UserDTO) {
    return this.userService.edit(data)
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    return this.userService.list(id)
  }

  @Get('/page')
  async page(@Query('page') page: number, @Query('size') size: number) {
    return await this.userService.page(page, size)
  }

  @Get('/list')
  async list() {
    return await this.userService.list()
  }
}
