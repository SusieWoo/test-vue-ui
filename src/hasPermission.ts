// 按钮权限
import { UserModule } from '@/store/modules/user'

export function hasPermission(permission: any) {
  let role = UserModule.roles
  return role.indexOf(permission) > -1
}
