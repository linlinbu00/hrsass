import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getTime } from './auth'
const timeOut = 600000000
// 检查token是否超时
function isCheckTime() {
  return Date.now() - getTime() < timeOut
}
// 创建axios实例
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
})
// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = store.getters.token
    // console.log(token)
    if (token) {
      if (isCheckTime()) {
        config.headers.Authorization = `Bearer ${token}`
      } else {
        Message.error('登陆过期，请重新登录')
        store.dispatch('user/logOut')
        router.push('/')
        return Promise.reject('')
      }
    }
    return config // 必须return
  },
  error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(response => {
  // 解构
  const { data: { data, message, success }} = response
  // 如果数据里success为true
  if (success) {
    return data // 解构后的data return出去
  }
  Message.error(message || '系统错误') // 错误提示
  return Promise.reject(message || '系统错误') // 在该接口处进行报错 如果不在这里报错则会走成功回调
},
error => {
  if (error?.response?.status === 401) {
    store.dispatch('user/logOut')
    router.push('/login')
  }
  Message.error(error.response?.data?.message || '系统错误')
  return Promise.reject(error)
}
)

export default request
