import Cookies from 'js-cookie'

const TokenKey = 'hrsass_token'
const timeKey = 'time_key'
export function getToken() { // return一个从本地拿出token的方法
  return Cookies.get(TokenKey)
}

export function setToken(token) { // return一个从本地存入token的方法
  return Cookies.set(TokenKey, token)
}

export function removeToken() { // return一个从本地移除token的方法
  return Cookies.remove(TokenKey)
}
export const setTime = () => {
  Cookies.set(timeKey, Date.now())
}
export const getTime = () => {
  return Cookies.get(timeKey)
}
