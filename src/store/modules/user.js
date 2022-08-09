import { getToken, setToken, removeToken, setTime } from '@/utils/auth.js' // 引入封装好的函数
import { getUserInfo, login, getUserDetailById } from '@/api/user.js' // 引入登录请求
import { resetRouter } from '@/router'
// 状态
const state = {
  // 初始化时把本地的token赋值给vuex一份
  token: getToken(), // 调用封装好的方法
  userInfo: {}
}
// 修改状态
const mutations = {
  setToken(state, token) {
    // 设置token
    state.token = token // 存在vuex一份
    // 存token
    setToken(token) // 调用在auth.js里封装好的方法
  },
  removeToken(state) {
    // 移除token
    state.token = null
    removeToken() // 调用封装好的方法
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    const res = await login(data)
    console.log(res) // 此时打印的就是token了
    setTime()
    // context.commit('setToken', res.data.data)  在请求拦截器里解构且return出来了 因此此时只需要写data即可
    context.commit('setToken', res)
  },
  // 注意！ 这里不能写try catch捕获错误 如果将错误捕获则后续也会走成功回调 即--即使错误也会跳转首页
  async getUserInfo(context) {
    const res = await getUserInfo()
    // console.log(res)
    const baseInfo = await getUserDetailById(res.userId) // 把上一个请求拿到的数据里的id传到下一个请求

    // context.commit('setUserInfo', res)
    context.commit('setUserInfo', { ...res, ...baseInfo }) //  拼接数据
    return { ...baseInfo, ...res }
  },
  logOut(context) {
    context.commit('removeUserInfo')
    context.commit('removeToken')
    // 重置路由匹配信息
    resetRouter()
    // vuex里面的路由表清空
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

