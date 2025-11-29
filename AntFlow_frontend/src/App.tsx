import { Suspense, useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ConfigProvider, Spin } from '@ui'
import zhCN from '@ui/locale/zh_CN'
import router from './router'
import { isInIframe, hasIframeParam } from './utils/iframe'
import { getToken as getStoredToken, removeToken } from './utils/storage'
import { fetchCurrentUser } from './api/auth'
import { useAppDispatch } from './store/hooks'
import { setToken as setTokenAction, setUserInfo, logout } from './store/slices/userSlice'
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
    if (!token) {
      setBootstrapping(false)
      return
    }
    dispatch(setTokenAction(token))
    fetchCurrentUser()
      .then((res) => {
        if (res?.data) {
          dispatch(setUserInfo(res.data))
        }
      })
      .catch(() => {
        removeToken()
        dispatch(logout())
      })
      .finally(() => {
        setBootstrapping(false)
      })
  }, [dispatch])

  if (bootstrapping) {
    return (
      <ConfigProvider locale={zhCN}>
        <div
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Spin size="large" />
        </div>
      </ConfigProvider>
    )
  }

  return (
    <ConfigProvider locale={zhCN}>
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
            <Spin size="large" />
          </div>
        }>
          <RouterProvider router={router} />
        </Suspense>
      </div>
    </ConfigProvider>
  )
}

export default App
