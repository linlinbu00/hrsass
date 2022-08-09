// vuex的权限模块
import { constantRoutes, asyncRoutes } from '@/router'
// vuex中的permission模块用来存放当前的 静态路由 + 当前用户的 权限路由
const state = {
  routes: constantRoutes // 所有人默认拥有静态路由
}
const mutations = {
  // newRoutes可以认为是 用户登录 通过权限所得到的动态路由的部分
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户的所拥有的菜单权限
  // menus: ["settings","permissions"]
  // asyncRoutes是所有的动态路由
  // asyncRoutes  [{path: 'setting',name: 'setting'},{}]
  filterRoutes(context, menus) {
    //   筛选出 动态路由中和menus中能够对上的路由
    const resRoutes = asyncRoutes.filter(item => {
      return menus.includes(item.name)
    })
    // asyncRoutes 找 有没有对象中的name属性 得到的resRoutes 是所有模块中满足权限要求的路由数组
    // resRoutes就是当前用户所拥有的 动态路由的权限
    context.commit('setRoutes', resRoutes) // 将动态路由提交给mutations
    return resRoutes // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

