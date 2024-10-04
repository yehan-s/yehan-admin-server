import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { UserService } from './user.service'
import { UserDTO } from './dto/user.dto'
import { ApiOperation } from '@nestjs/swagger'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '创建用户' })
  @Post('/')
  async create(@Body() data: UserDTO) {
    return this.userService.create(data)
  }

  @ApiOperation({ summary: '编辑用户信息' })
  @Put('/')
  async edit(@Body() data: UserDTO) {
    return this.userService.edit(data)
  }

  // @ApiOperation({ summary: '获取用户信息' })
  // @Get('/find/:id')
  // async getById(@Param('id') id: string) {
  //   return this.userService.list(id)
  // }

  @ApiOperation({ summary: '分页获取用户列表' })
  @Get('/page')
  async page(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
  ) {
    return this.userService.page(page, size)
  }

  @ApiOperation({ summary: '获取用户列表' })
  @Get('/list')
  async list() {
    return this.userService.list()
  }
}
