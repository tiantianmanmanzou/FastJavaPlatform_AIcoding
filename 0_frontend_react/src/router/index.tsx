import { createHashRouter, Navigate } from 'react-router-dom'
import NavigationLayout from '../components/layouts/NavigationLayout'
import RequireAuth from '../components/auth/RequireAuth'
import Navigation from '../views/navigation/index'
import UserManagementTabs from '../views/UserManagement/UserManagementTabs'
import UserManagementUser from '../views/UserManagement/UserManagement-User'
import UserManagementRole from '../views/UserManagement/UserManagement-Role'
import UserManagementPermission from '../views/UserManagement/UserManagement-Permission'
import LogManagement from '../views/LogManagement/LogManagement'
import ProductSaleTabs from '../views/productsale/ProductSaleTabs'
import ProductSaleApply from '../views/productsale/ProductSale-Apply'
import ProductSaleAudit from '../views/productsale/ProductSale-Audit'
import ProductSaleDisplay from '../views/productsale/ProductSale-Display'
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
        element: <NavigationLayout pageName="企业数据管理平台" breadcrumbs={[]} />,
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
            path: 'product-sale',
            element: <ProductSaleTabs />,
            children: [
              {
                index: true,
                element: <Navigate to="/product-sale/apply" replace />
              },
              {
                path: 'apply',
                element: <ProductSaleApply />,
                handle: { title: '上架申请', breadcrumb: ['商品管理', '商品上架管理', '上架申请'] }
              },
              {
                path: 'audit',
                element: <ProductSaleAudit />,
                handle: { title: '上架审核', breadcrumb: ['商品管理', '商品上架管理', '上架审核'] }
              },
              {
                path: 'display',
                element: <ProductSaleDisplay />,
                handle: { title: '商品展示', breadcrumb: ['商品管理', '商品上架管理', '商品展示'] }
              }
            ]
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
