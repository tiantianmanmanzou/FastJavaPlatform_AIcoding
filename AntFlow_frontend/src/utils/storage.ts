const TOKEN_KEY = 'auth_token'

const getBrowserStorage = () => {
  if (typeof window === 'undefined') {
    return undefined
  }
  return window.localStorage
}

// Token相关
export const getToken = (): string | undefined => {
  try {
    const storage = getBrowserStorage()
    return storage ? storage.getItem(TOKEN_KEY) || undefined : undefined
  } catch (error) {
    console.error('读取Token失败', error)
    return undefined
  }
}

export const setToken = (token: string): void => {
  try {
    const storage = getBrowserStorage()
    storage?.setItem(TOKEN_KEY, token)
  } catch (error) {
    console.error('写入Token失败', error)
  }
}

export const removeToken = (): void => {
  try {
    const storage = getBrowserStorage()
    storage?.removeItem(TOKEN_KEY)
  } catch (error) {
    console.error('删除Token失败', error)
  }
}

// LocalStorage 封装
export const storage = {
  get(key: string): any {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('Storage get error:', error)
      return null
    }
  },

  set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Storage set error:', error)
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Storage remove error:', error)
    }
  },

  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Storage clear error:', error)
    }
  }
}

// SessionStorage 封装
export const sessionStorage = {
  get(key: string): any {
    try {
      const value = window.sessionStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('SessionStorage get error:', error)
      return null
    }
  },

  set(key: string, value: any): void {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('SessionStorage set error:', error)
    }
  },

  remove(key: string): void {
    try {
      window.sessionStorage.removeItem(key)
    } catch (error) {
      console.error('SessionStorage remove error:', error)
    }
  },

  clear(): void {
    try {
      window.sessionStorage.clear()
    } catch (error) {
      console.error('SessionStorage clear error:', error)
    }
  }
}
