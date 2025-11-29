import { createHashRouter, Navigate } from 'react-router-dom'
import NavigationLayout from '../components/layouts/NavigationLayout'
import RequireAuth from '../components/auth/RequireAuth'
import Navigation from '../views/navigation/index'
import UserManagementTabs from '../views/UserManagement/UserManagementTabs'
import UserManagementUser from '../views/UserManagement/UserManagement-User'
import UserManagementRole from '../views/UserManagement/UserManagement-Role'
import UserManagementPermission from '../views/UserManagement/UserManagement-Permission'
import LogManagement from '../views/LogManagement/LogManagement'

import ProductManagementPage from '../views/ProductManagement'
import ContentCreationPage from '../views/ContentCreation'
import Login from '../views/auth/Login'

const router = createHashRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <NavigationLayout pageName="溢流内容管理平台" breadcrumbs={[]} />,
        children: [
          {
            index: true,
            element: <Navigate to="/navigation" replace />
          },
          {
            path: 'log-management',
            element: <LogManagement />,
            handle: { title: '日志管理', breadcrumb: ['系统管理', '日志管理'] }
          },
          {
            path: 'user-management',
            element: <UserManagementTabs />,
            children: [
              {
                index: true,
                element: <Navigate to="/user-management/user" replace />
              },
              {
                path: 'user',
                element: <UserManagementUser />,
                handle: { title: '用户管理', breadcrumb: ['系统管理', '用户权限管理', '用户管理'] }
              },
              {
                path: 'role',
                element: <UserManagementRole />,
                handle: { title: '角色管理', breadcrumb: ['系统管理', '用户权限管理', '角色管理'] }
              },
              {
                path: 'permission',
                element: <UserManagementPermission />,
                handle: { title: '权限管理', breadcrumb: ['系统管理', '用户权限管理', '权限管理'] }
              }
            ]
          },

          {
            path: 'product-management',
            element: <ProductManagementPage />,
            handle: { title: '产品管理', breadcrumb: ['产品管理'] }
          },
          {
            path: 'content-creation',
            element: <ContentCreationPage />,
            handle: { title: '内容创作', breadcrumb: ['内容创作'] }
          },
          {
            path: 'navigation',
            element: <Navigation />,
            handle: { title: '导航页面', breadcrumb: ['导航页面'] }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/navigation" replace />
  }
])

export default router
