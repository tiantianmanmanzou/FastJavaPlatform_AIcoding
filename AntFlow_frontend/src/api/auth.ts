import request from '../utils/request'
import type { ApiResponse } from './types'
import type { LoginResult, User } from '../types'

export interface LoginPayload {
  username: string
  password: string
}

export const login = (data: LoginPayload) =>
  request.post<ApiResponse<LoginResult>>('/auth/login', data)

export const fetchCurrentUser = () =>
  request.get<ApiResponse<User>>('/auth/info')
