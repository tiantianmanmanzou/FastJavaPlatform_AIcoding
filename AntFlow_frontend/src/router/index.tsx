import { createHashRouter, Navigate } from 'react-router-dom'
import NavigationLayout from '../layout/NavigationLayout'
import RequireAuth from '../components/auth/RequireAuth'
import UserManagementTabs from '../views/UserManagement/UserManagementTabs'
import UserManagementUser from '../views/UserManagement/UserManagement-User'
import UserManagementRole from '../views/UserManagement/UserManagement-Role'
import UserManagementPermission from '../views/UserManagement/UserManagement-Permission'
import LogManagement from '../views/LogManagement/LogManagement'

import ProductManagementPage from '../views/ProductManagement'
import ProductDetailPage from '../views/ProductManagement/ProductDetailPage'
import ContentCreationPage from '../views/ContentCreation'
import PromptManagementPage from '../views/PromptManagement'
import Login from '../views/auth/Login'
import LlmAccessPage from '../views/SystemManagement/LlmAccessPage'
import ThreadManagementPage from '../views/SystemManagement/ThreadManagementPage'
import ModelComparisonPage from '../views/SystemManagement/ModelComparisonPage'

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
            element: <Navigate to="/content-creation" replace />
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
            path: 'product-management/:id',
            element: <ProductDetailPage />,
            handle: { title: '产品详情', breadcrumb: ['产品管理', '产品详情'] }
          },
          {
            path: 'prompt-management',
            element: <PromptManagementPage />,
            handle: { title: '提示词管理', breadcrumb: ['系统管理', '提示词管理'] }
          },
          {
            path: 'llm-access',
            element: <LlmAccessPage />,
            handle: { title: '大模型接入', breadcrumb: ['大模型接入'] }
          },
          {
            path: 'system-management/thread-management',
            element: <ThreadManagementPage />,
            handle: { title: '线程管理', breadcrumb: ['系统管理', '线程管理'] }
          },
          {
            path: 'system-management/model-comparison',
            element: <ModelComparisonPage />,
            handle: { title: '模型对比', breadcrumb: ['系统管理', '模型对比'] }
          },
          {
            path: 'content-creation',
            element: <ContentCreationPage />,
            handle: { title: '内容创作', breadcrumb: ['内容创作'] }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/content-creation" replace />
  }
])

export default router
