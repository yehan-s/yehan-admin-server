import { ApiProperty } from '@nestjs/swagger'
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class UserDTO {
  @ApiProperty({ description: 'id' })
  @IsOptional()
  @IsString()
  id?: string

  @IsOptional()
  @IsDate()
  create_time?: Date

  @IsOptional()
  @IsDate()
  update_time?: Date

  @ApiProperty({ description: '用户名称' })
  @IsNotEmpty({ message: '用户名称不能为空' })
  @IsString()
  userName: string

  @ApiProperty({ description: '用户昵称' })
  @IsNotEmpty({ message: '用户昵称不能为空' })
  @IsString()
  nickName: string

  @ApiProperty({ description: '手机号' })
  @IsNotEmpty({ message: '无效的手机号格式' })
  @IsString()
  phoneNumber: string

  @ApiProperty({ description: '邮箱' })
  @IsNotEmpty({ message: '无效的邮箱格式' })
  @IsString()
  email: string

  @ApiProperty({ description: '头像', nullable: true })
  @IsOptional()
  @IsString()
  avatar?: string

  @ApiProperty({ description: '性别(0:女, 1:男)', nullable: true })
  @IsOptional()
  @IsInt()
  sex?: number

  @ApiProperty({ description: '密码' })
  @IsString()
  password: string
}
