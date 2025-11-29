import axios from 'axios'
import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { message } from '@ui'
import { getToken, removeToken } from './storage'

let redirectingToLogin = false
let lastErrorMessage = ''
let lastErrorTime = 0

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api', // url = base url + request url
  timeout: 10000, // 请求超时时间
  withCredentials: true // 跨域请求时发送Cookie
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    // 处理请求错误
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data

    // 如果返回的状态码不是200，说明接口有问题，将会在下方做错误处理
    if (res.code && res.code !== 200) {
      message.error(res.message || '请求错误')
      return Promise.reject(new Error(res.message || '请求错误'))
    } else {
      return res
    }
  },
  (error: AxiosError) => {
    console.log('err' + error) // for debug
    const { status } = error.response || {}
    const errorMsg = (error.response?.data as any)?.message || error.message

    // 检查当前是否在登录页
    const isLoginPage = window.location.hash.includes('/login')

    // 根据HTTP状态码显示不同的错误消息
    let messageText = '网络错误，请稍后再试'
    if (status === 400) {
      messageText = '请求参数错误'
    } else if (status === 401) {
      messageText = '未授权，请重新登录'
    } else if (status === 403) {
      messageText = '拒绝访问'
    } else if (status === 404) {
      messageText = '请求的资源不存在'
    } else if (status && status >= 500) {
      messageText = '服务器错误，请联系管理员'
    }

    const finalMessage = errorMsg || messageText
    const now = Date.now()

    // 如果在登录页且是 401 错误，不显示错误提示
    // 或者如果是相同的错误消息且在1秒内，不重复显示
    if (!(isLoginPage && status === 401)) {
      if (finalMessage !== lastErrorMessage || now - lastErrorTime > 1000) {
        message.error(finalMessage)
        lastErrorMessage = finalMessage
        lastErrorTime = now
      }
    }

    if (status === 401 && !redirectingToLogin) {
      redirectingToLogin = true
      removeToken()
      setTimeout(() => {
        redirectingToLogin = false
      }, 1000)
      // 只有不在登录页时才跳转
      if (!isLoginPage) {
        window.location.hash = '#/login'
      }
    }

    return Promise.reject(error)
  }
)

export default service
