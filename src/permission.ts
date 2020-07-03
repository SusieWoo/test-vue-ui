import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
import i18n from '@/lang' // Internationalization
import settings from './settings'

NProgress.configure({ showSpinner: false })

// 白名单
const whiteList = ['/login']

const getPageTitle = (key: string) => {
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${settings.title}`
  }
  return `${settings.title}`
}

router.beforeEach(async (to: Route, _: Route, next: any) => {
  NProgress.start()
  if (UserModule.token) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // 注意:角色必须是一个对象数组!例如:['admin']或['developer'， 'editor']
      //如果没有任何角色
      if (UserModule.roles.length === 0) {
        try {
          //获取用户信息
          await UserModule.GetUserInfo()
          const roles = UserModule.roles
          // 根据角色设置可访问路由
          PermissionModule.GenerateRoutes(roles)
          // 动态添加可访问路由（所有路由）
          router.addRoutes(PermissionModule.dynamicRoutes)
          // Hack:确保addRoutes是完整的
          // 设置replace: true，这样导航将不会留下历史记录
          next({ ...to, replace: true }) /*...相当于它拷贝了一个to对象*/
        } catch (err) {
          // 无用户信息 删除token并重定向到登录页面
          UserModule.ResetToken()
          Message.error(err || '用户信息获取失败')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      } else {
        next()
      }
    }
  } else {
    // 白名单通过 直接登录
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // 其他没有访问权限的页面被重定向到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

//注意：当页面在首页的时候手动跳转到login页面，router.afterEach是不会被触发的。
router.afterEach((to: Route) => {
  // Finish progress bar
  NProgress.done()

  // set page title
  // document.title = getPageTitle(to.meta.title)
  console.log(getPageTitle(to.meta.title))
})
