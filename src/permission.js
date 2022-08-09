import router from './router'
import store from './store'
// import NProgress from 'nprogress' // 引入一份进度条插件
// import 'nprogress/nprogress.css' // 引入进度条样式

const loginPath = '/login'
const notFoundPath = '/404'
// 白名单 --login页面和404页面
const whiteList = [loginPath, notFoundPath]
// 前置守卫
// 监听路由的变化
router.beforeEach(async(to, from, next) => {
  // NProgress.start()
  const token = store.getters.token // 此时token固定
  // 存在token
  if (token) {
    // 有token的位置去获取用户资料
    // 如果没有id这个值 才会调用 vuex的获取资料的action
    if (!store.getters.token) {
      const res = await store.dispatch('user/getUserInfo')
      console.log(res)
      // 添加用户拥有的路由权限再去跳转
      const routes = await store.dispatch('permission/filterRoutes', res.roles.menus)
      router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
    }
    // 如果去到的路径是登陆页面停留在首页
    if (to.path === loginPath) {
      next('/')
    } else {
      // 否则放行
      next()
    }
  } else {
    // 没有token时 如果想去到白名单里 直接放行
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 想去到别的页面 跳到登陆页面
      next(loginPath)
    }
  }
  // NProgress.done()
})
// 后置守卫
// router.afterEach(function() {
//   NProgress.done() // 关闭进度条
// })
