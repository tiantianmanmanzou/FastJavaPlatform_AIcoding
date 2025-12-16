import axios from 'axios'
import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios'
import { message } from '@/lib/message'
import { getToken } from './storage'

// 扩展 AxiosRequestConfig 以支持静默模式
declare module 'axios' {
  export interface AxiosRequestConfig {
    silent?: boolean // 静默模式，不显示错误提示
  }
}

let lastErrorMessage = ''
let lastErrorTime = 0
// 存储当前请求的静默状态
let currentRequestSilent = false

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api', // url = base url + request url
  timeout: 10000, // 请求超时时间
  withCredentials: true // 跨域请求时发送Cookie
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 保存静默状态
    currentRequestSilent = !!(config as AxiosRequestConfig).silent

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
      // 如果是401错误，特殊处理，保持原始错误信息
      if (res.code === 401) {
        const error = new Error(res.message || '未授权')
        ;(error as any).status = 401
        ;(error as any).response = { status: 401, data: res }
        // 静默模式或在登录页，不显示错误提示
        const isLoginPage = window.location.hash.includes('/login')
        if (!currentRequestSilent && !isLoginPage) {
          message.error(res.message || '请求错误')
        }
        return Promise.reject(error)
      }
      // 静默模式不显示错误提示
      if (!currentRequestSilent) {
        message.error(res.message || '请求错误')
      }
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

    // 静默模式不显示错误提示
    // 如果在登录页且是 401 错误，不显示错误提示
    // 或者如果是相同的错误消息且在1秒内，不重复显示
    if (!currentRequestSilent && !(isLoginPage && status === 401)) {
      if (finalMessage !== lastErrorMessage || now - lastErrorTime > 1000) {
        message.error(finalMessage)
        lastErrorMessage = finalMessage
        lastErrorTime = now
      }
    }

    // 暂时禁用自动重定向到登录页
    // if (status === 401 && !redirectingToLogin) {
    //   redirectingToLogin = true
    //   // 延迟处理，避免在页面加载时立即重定向
    //   setTimeout(() => {
    //     const currentToken = getToken()
    //     if (!currentToken) {
    //       removeToken()
    //       if (!isLoginPage) {
    //         window.location.hash = '#/login'
    //       }
    //     }
    //     redirectingToLogin = false
    //   }, 1000)
    // }

    return Promise.reject(error)
  }
)

const request = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return service.get<any, T>(url, config)
  },
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return service.post<any, T>(url, data, config)
  },
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return service.put<any, T>(url, data, config)
  },
  delete<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return service.delete<any, T>(url, config)
  }
}

export default request
