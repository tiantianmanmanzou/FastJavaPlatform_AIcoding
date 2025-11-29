import request from '../utils/request'
import type { ApiResponse, PageData } from './types'
import type { User } from '../types'

export interface UserQueryParams {
  page: number
  pageSize: number
  username?: string
  email?: string
  status?: number | ''
}

export interface UserFormPayload {
  username: string
  email?: string
  realName?: string
  mobile?: string
  department?: string
  status?: number
  roleIds: number[]
}

export interface UserCreatePayload extends UserFormPayload {
  password: string
}

export const fetchUsers = (params: UserQueryParams) =>
  request.get<ApiResponse<PageData<User>>>('/users', { params })

export const createUser = (data: UserCreatePayload) =>
  request.post<ApiResponse<User>>('/users', data)

export const updateUser = (id: number, data: UserFormPayload) =>
  request.put<ApiResponse<User>>(`/users/${id}`, data)

export const deleteUser = (id: number) =>
  request.delete<ApiResponse<void>>(`/users/${id}`)

export const batchDeleteUsers = (ids: number[]) =>
  request.delete<ApiResponse<void>>('/users/batch', { data: ids })

export const updateUserPassword = (id: number, password: string) =>
  request.put<ApiResponse<void>>(`/users/${id}/password`, { password })

export const updateUserStatus = (id: number, status: number) =>
  request.put<ApiResponse<void>>(`/users/${id}/status`, { status })
