import request from '../utils/request'
import type { ApiResponse, PageData } from './types'
import type { Permission, PermissionTreeNode } from '../types'

export interface PermissionQueryParams {
  page: number
  pageSize: number
  permissionName?: string
  permissionCode?: string
  type?: string | ''
}

export interface PermissionPayload {
  permissionName: string
  permissionCode: string
  type: string
  parentId?: number | null
  path?: string
  method?: string
  sort?: number
}

export const fetchPermissions = (params: PermissionQueryParams) =>
  request.get<ApiResponse<PageData<Permission>>>('/permissions', { params })

export const createPermission = (data: PermissionPayload) =>
  request.post<ApiResponse<Permission>>('/permissions', data)

export const updatePermission = (id: number, data: PermissionPayload) =>
  request.put<ApiResponse<Permission>>(`/permissions/${id}`, data)

export const deletePermission = (id: number) =>
  request.delete<ApiResponse<void>>(`/permissions/${id}`)

export const fetchPermissionTree = () =>
  request.get<ApiResponse<PermissionTreeNode[]>>('/permissions/tree')
