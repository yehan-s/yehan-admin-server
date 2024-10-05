import { ApiProperty, OmitType } from '@nestjs/swagger'
import { UserDTO } from './user.dto'

export class UserVO extends OmitType(UserDTO, ['password'] as const) {
  @ApiProperty({ description: '图片路径' })
  avatar?: string
}
