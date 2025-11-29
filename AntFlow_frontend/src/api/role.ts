import request from '../utils/request'
import type { ApiResponse, PageData } from './types'
import type { Role } from '../types'

export interface RoleQueryParams {
  page: number
  pageSize: number
  roleName?: string
  status?: number | ''
}

export interface RolePayload {
  roleName: string
  roleCode: string
  description?: string
  status?: number
}

export const fetchRoles = (params: RoleQueryParams) =>
  request.get<ApiResponse<PageData<Role>>>('/roles', { params })

export const fetchAllRoles = () =>
  request.get<ApiResponse<Role[]>>('/roles/all')

export const createRole = (data: RolePayload) =>
  request.post<ApiResponse<Role>>('/roles', data)

export const updateRole = (id: number, data: RolePayload) =>
  request.put<ApiResponse<Role>>(`/roles/${id}`, data)

export const deleteRole = (id: number) =>
  request.delete<ApiResponse<void>>(`/roles/${id}`)

export const fetchRoleDetail = (id: number) =>
  request.get<ApiResponse<Role>>(`/roles/${id}`)

export const assignRolePermissions = (id: number, permissionIds: number[]) =>
  request.post<ApiResponse<void>>(`/roles/${id}/permissions`, { permissionIds })
