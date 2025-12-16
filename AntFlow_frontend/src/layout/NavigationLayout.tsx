import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useMatches, Outlet } from 'react-router-dom'
import { message } from '@/lib/message'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../store/slices/userSlice'
import { removeToken } from '../utils/storage'
import platformLogo from '../assets/platform-logo.png'
import '../styles/NavigationLayout.scss'

interface NavigationLayoutProps {
  pageName?: string
  breadcrumbs?: string[]
}

const NavigationLayout: React.FC<NavigationLayoutProps> = ({
  pageName = '默认页面',
  breadcrumbs = []
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const matches = useMatches()
  const dispatch = useAppDispatch()
  const userInfo = useAppSelector((state) => state.user.userInfo)

  const [dropdowns, setDropdowns] = useState<Record<string, boolean>>({
    'system-admin': false,
    'user-menu': false
  })

  const [activePage, setActivePage] = useState('')

  const routeConfig = {
    'system-admin': {
      '用户管理': '/user-management/user',
      '线程管理': '/system-management/thread-management',
      '模型对比': '/system-management/model-comparison',
      '日志管理': '/log-management'
    }
  }

  useEffect(() => {
    setActivePage(pageName)
  }, [pageName])

  const showDropdown = (menuId: string) => {
    setDropdowns((prev) => ({ ...prev, [menuId]: true }))
  }

  const hideDropdown = (menuId: string) => {
    setDropdowns((prev) => ({ ...prev, [menuId]: false }))
  }

  const toggleDropdown = (menuId: string) => {
    setDropdowns((prev) => ({ ...prev, [menuId]: !prev[menuId as keyof typeof prev] }))
  }

  const navigateTo = (target: string) => {
    if (target === location.pathname) return
    navigate(target)
  }

  const isActiveModule = (moduleId: string) => {
    if (activePage === '') return false

    const modulePages = Object.keys(routeConfig[moduleId as keyof typeof routeConfig] || {})
    if (modulePages.includes(pageName)) {
      return true
    }

    const currentPath = location.pathname
    const modulePaths = Object.values(routeConfig[moduleId as keyof typeof routeConfig] || {})
    if (modulePaths.includes(currentPath)) {
      return true
    }

    if (modulePages.includes(activePage)) {
      return true
    }

    return false
  }

  const handleLogout = async () => {
    const confirmed = window.confirm('确认退出登录？')
    if (!confirmed) return
    try {
      removeToken()
      dispatch(logout())
      message.success('已退出登录')
      await new Promise((resolve) => setTimeout(resolve, 100))
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
      message.error('退出登录失败')
    }
  }

  const isDirectNavActive = (paths: string[], names: string[]) => {
    if (names.includes(activePage)) {
      return true
    }
    return paths.some((path) => location.pathname.startsWith(path))
  }

  const getFinalBreadcrumbs = () => {
    if (breadcrumbs.length > 0) {
      return breadcrumbs
    }

    const routeBreadcrumbs: string[] = []

    matches.forEach((match) => {
      if (match.handle && (match.handle as any).breadcrumb) {
        const breadcrumb = (match.handle as any).breadcrumb
        if (Array.isArray(breadcrumb)) {
          routeBreadcrumbs.push(...breadcrumb)
        } else {
          routeBreadcrumbs.push(breadcrumb)
        }
      }
    })

    if (routeBreadcrumbs.length > 0) {
      return routeBreadcrumbs
    }

    return pageName ? [pageName] : []
  }

  const finalBreadcrumbs = getFinalBreadcrumbs()

  return (
    <div className="governance-layout">
      <div className="header">
        <div className="logo">
          <img src={platformLogo} alt="平台Logo" className="platform-logo" />
          <div className="system-name">溢流内容管理平台</div>
        </div>
        <div className="header-right">
          <div className="nav-menu">
            <div
              className={`nav-item ${isDirectNavActive(['/product-management'], ['产品管理']) ? 'active' : ''}`}
              onClick={() => navigateTo('/product-management')}
            >
              <i className="icon icon-shopping"></i>
              <span>产品管理</span>
            </div>
            <div
              className={`nav-item ${isDirectNavActive(['/content-creation'], ['内容创作']) ? 'active' : ''}`}
              onClick={() => navigateTo('/content-creation')}
            >
              <i className="icon icon-chart"></i>
              <span>内容创作</span>
            </div>
            <div
              className={`nav-item ${isDirectNavActive(['/prompt-management'], ['提示词管理']) ? 'active' : ''}`}
              onClick={() => navigateTo('/prompt-management')}
            >
              <i className="icon icon-list"></i>
              <span>提示词管理</span>
            </div>
            <div
              className={`nav-item ${isDirectNavActive(['/llm-access'], ['大模型接入']) ? 'active' : ''}`}
              onClick={() => navigateTo('/llm-access')}
            >
              <i className="icon icon-chart"></i>
              <span>大模型接入</span>
            </div>
            <div
              className={`nav-item ${isActiveModule('system-admin') ? 'active' : ''}`}
              onMouseEnter={() => showDropdown('system-admin')}
              onMouseLeave={() => hideDropdown('system-admin')}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleDropdown('system-admin')
              }}
            >
              <i className="icon icon-chart"></i>
              <span>系统管理</span>
              <div className={`dropdown-menu ${dropdowns['system-admin'] ? 'show' : ''}`}>
                {Object.entries(routeConfig['system-admin']).map(([label, path]) => (
                  <div
                    key={label}
                    className={`dropdown-item ${activePage === label ? 'active' : ''}`}
                    onClick={() => {
                      hideDropdown('system-admin')
                      navigateTo(path)
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className="user-section"
            onMouseEnter={() => showDropdown('user-menu')}
            onMouseLeave={() => hideDropdown('user-menu')}
          >
            <span className="user-name">{userInfo?.realName || userInfo?.username || '管理员'}</span>
            <div className={`dropdown-menu ${dropdowns['user-menu'] ? 'show' : ''}`} style={{ right: 0 }}>
              <div
                className="dropdown-item"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleLogout()
                }}
              >
                退出登录
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="breadcrumb breadcrumb-container">
        {finalBreadcrumbs.map((crumb, index) => (
          <span key={crumb}>
            {crumb}
            {index < finalBreadcrumbs.length - 1 && ' / '}
          </span>
        ))}
      </div>

      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}

export default NavigationLayout
