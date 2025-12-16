import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Users, Shield, Key } from 'lucide-react'
import { cn } from '@/lib/utils'
import './UserManagementTabs.scss'

const menuItems = [
  { key: '/user-management/user', label: '用户管理', icon: Users },
  { key: '/user-management/role', label: '角色管理', icon: Shield },
  { key: '/user-management/permission', label: '权限管理', icon: Key }
]

const UserManagementTabs: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavigate = (path: string) => {
    if (location.pathname === path) return
    navigate(path)
  }

  return (
    <div className="user-management-tabs-layout">
      <aside className="tabs-sidebar">
        <div className="tabs-menu">
          {menuItems.map((item) => {
            const active = location.pathname.startsWith(item.key)
            const Icon = item.icon
            return (
              <button
                key={item.key}
                className={cn('tabs-menu-item', active && 'active')}
                onClick={() => handleNavigate(item.key)}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </aside>
      <main className="tabs-content">
        <Outlet />
      </main>
    </div>
  )
}

export default UserManagementTabs
