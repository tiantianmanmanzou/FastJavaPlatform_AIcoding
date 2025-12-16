import { Suspense, useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import router from './router'
import { isInIframe, hasIframeParam } from './utils/iframe'
import { getToken as getStoredToken, removeToken } from './utils/storage'
import { fetchCurrentUser } from './api/auth'
import { useAppDispatch } from './store/hooks'
import { setToken as setTokenAction, setUserInfo, logout } from './store/slices/userSlice'
import type { User } from './types'
import { Spinner } from './components/ui/spinner'
import './App.css'

function App() {
  const isIframeMode = isInIframe() || hasIframeParam()
  const dispatch = useAppDispatch()
  const [bootstrapping, setBootstrapping] = useState(true)

  useEffect(() => {
    // Set global iframe mode
    ;(window as any).VUE_APP_IFRAME_MODE = isIframeMode

    if (isIframeMode) {
      console.log('应用运行在iframe模式下')
      document.body.classList.add('iframe-embedded')
    }

    // Trigger render complete event
    const timer = setTimeout(() => {
      document.dispatchEvent(new Event('render-event'))
    }, 100)

    return () => clearTimeout(timer)
  }, [isIframeMode])

  useEffect(() => {
    const token = getStoredToken()
    const isLoginPage = window.location.hash.includes('/login')

    // 如果没有 token，直接结束 bootstrapping
    if (!token) {
      setBootstrapping(false)
      return
    }

    // 如果在登录页，不发起用户信息请求，直接结束 bootstrapping
    // 保留 token（用户可能是登录成功后手动访问登录页）
    if (isLoginPage) {
      setBootstrapping(false)
      return
    }

    dispatch(setTokenAction(token))
    
    // 添加超时处理，避免长时间等待
    const timeoutId = setTimeout(() => {
      console.warn('获取用户信息超时，可能token已失效')
      setBootstrapping(false)
    }, 5000)
    
    fetchCurrentUser({ silent: true })
      .then((res) => {
        clearTimeout(timeoutId)
        if (res?.data) {
          // res.data 就是 User 类型，不需要再次访问 .data
          const user: User = {
            id: Number(res.data.id),
            username: res.data.username,
            email: res.data.email,
            status: Number(res.data.status),
            realName: res.data.realName,
            department: res.data.department,
            mobile: res.data.mobile,
            createTime: res.data.createTime,
            updateTime: res.data.updateTime,
            roles: res.data.roles?.map((role: any) => ({
              roleId: Number(role.roleId),
              roleName: role.roleName,
              roleCode: role.roleCode
            }))
          }
          dispatch(setUserInfo(user))
        }
      })
      .catch((error) => {
        clearTimeout(timeoutId)
        console.error('获取用户信息失败:', error)
        // 只有在明确收到401错误时才清除token
        if (error?.response?.status === 401) {
          // 再次确认当前token是否与请求时的token一致
          const currentToken = getStoredToken()
          if (currentToken === token) {
            removeToken()
            dispatch(logout())
          }
        } else {
          // 其他错误不自动退出登录
          console.warn('网络错误，保持登录状态')
        }
      })
      .finally(() => {
        setBootstrapping(false)
      })
  }, [dispatch])

  if (bootstrapping) {
    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <div
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Spinner size="lg" />
        </div>
      </>
    )
  }

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <div 
        id="app"
        className={isIframeMode ? 'iframe-mode' : ''}
        style={{
          height: '100%',
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          margin: 0,
          padding: 0,
          boxSizing: 'border-box'
        }}
      >
        <Suspense fallback={
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
          }}>
            <Spinner size="lg" />
          </div>
        }>
          <RouterProvider router={router} />
        </Suspense>
      </div>
    </>
  )
}

export default App
