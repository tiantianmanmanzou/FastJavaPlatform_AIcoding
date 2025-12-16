import request from '@/utils/request'
import type { ApiResponse } from './types'
import type { PromptItem, PromptType } from '@/types'

export interface PromptQueryParams {
  keyword?: string
  type?: PromptType | ''
}

export interface PromptPayload {
  name: string
  content: string
  type: PromptType
}

export const fetchPrompts = (params?: PromptQueryParams) =>
  request.get<ApiResponse<PromptItem[]>>('/prompts', { params })

export const createPrompt = (data: PromptPayload) =>
  request.post<ApiResponse<PromptItem>>('/prompts', data)

export const updatePrompt = (id: number, data: PromptPayload) =>
  request.put<ApiResponse<PromptItem>>(`/prompts/${id}`, data)

export const deletePrompt = (id: number) =>
  request.delete<ApiResponse<void>>(`/prompts/${id}`)
