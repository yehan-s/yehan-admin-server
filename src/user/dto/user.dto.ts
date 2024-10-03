import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UserDTO {
  @IsOptional()
  @IsInt()
  id?: number

  @IsNotEmpty({ message: '姓名不能为空' })
  @IsString()
  name: string

  @IsNotEmpty({ message: '年龄不能为空' })
  @IsInt()
  age: number
}
