import request from '@/utils/request'
import type { ApiResponse, PageData } from './types'
import type { LlmProvider, ModelComparison, ReasoningThread, ReasoningThreadMessage } from '@/types'

export interface LlmProviderQueryParams {
  page: number
  pageSize: number
  keyword?: string
  status?: number | ''
  providerType?: string
}

export interface LlmProviderPayload {
  providerCode: string
  providerName: string
  providerType: string
  vendor?: string
  modelName?: string
  baseUrl?: string
  apiKey?: string
  apiVersion?: string
  status: number
  defaultFlag?: number
  concurrencyLimit?: number
  timeoutSeconds?: number
  capabilityTags?: string
  description?: string
  metadata?: string
  apiParams?: Record<string, string>
}

export const fetchLlmProviders = (params: LlmProviderQueryParams) =>
  request.get<ApiResponse<PageData<LlmProvider>>>('/system/llm-providers', { params })

export const fetchLlmProviderDetail = (id: number) =>
  request.get<ApiResponse<LlmProvider>>(`/system/llm-providers/${id}`)

export const createLlmProvider = (data: LlmProviderPayload) =>
  request.post<ApiResponse<LlmProvider>>('/system/llm-providers', data)

export const updateLlmProvider = (id: number, data: LlmProviderPayload) =>
  request.put<ApiResponse<LlmProvider>>(`/system/llm-providers/${id}`, data)

export const deleteLlmProvider = (id: number) =>
  request.delete<ApiResponse<void>>(`/system/llm-providers/${id}`)

export const markLlmProviderDefault = (id: number) =>
  request.put<ApiResponse<void>>(`/system/llm-providers/${id}/default`)

export interface LlmParamTemplateOption {
  label: string
  value: string
  description?: string
}

export interface LlmParamTemplate {
  vendor: string
  generationType: string
  paramKey: string
  paramLabel: string
  inputType: string
  required?: number
  placeholder?: string
  defaultValue?: string
  description?: string
  options?: LlmParamTemplateOption[]
  sortOrder?: number
}

export const fetchLlmParamTemplates = (vendor: string, generationType: string) =>
  request.get<ApiResponse<LlmParamTemplate[]>>('/system/llm-providers/param-templates', {
    params: { vendor, generationType }
  })

export interface ReasoningThreadQueryParams {
  page: number
  pageSize: number
  keyword?: string
  status?: string
  providerCode?: string
}

export interface ReasoningThreadPayload {
  threadName: string
  providerCode?: string
  modelName?: string
  metadata?: string
}

export interface ReasoningThreadUpdatePayload {
  threadName: string
  status?: string
  metadata?: string
}

export const fetchReasoningThreads = (params: ReasoningThreadQueryParams) =>
  request.get<ApiResponse<PageData<ReasoningThread>>>('/system/reasoning-threads', { params })

export const createReasoningThread = (data: ReasoningThreadPayload) =>
  request.post<ApiResponse<ReasoningThread>>('/system/reasoning-threads', data)

export const updateReasoningThread = (id: number, data: ReasoningThreadUpdatePayload) =>
  request.put<ApiResponse<ReasoningThread>>(`/system/reasoning-threads/${id}`, data)

export const deleteReasoningThread = (id: number) =>
  request.delete<ApiResponse<void>>(`/system/reasoning-threads/${id}`)

export const fetchReasoningThreadMessages = (threadId: number) =>
  request.get<ApiResponse<ReasoningThreadMessage[]>>(`/system/reasoning-threads/${threadId}/messages`)

export const appendReasoningThreadMessage = (
  threadId: number,
  data: { role: string; content: string; tokenUsage?: number; latencyMillis?: number }
) => request.post<ApiResponse<ReasoningThreadMessage>>(`/system/reasoning-threads/${threadId}/messages`, data)

export const syncReasoningThread = (threadId: number) =>
  request.post<ApiResponse<ReasoningThread>>(`/system/reasoning-threads/${threadId}/sync`)

export interface ModelComparisonQueryParams {
  page: number
  pageSize: number
  keyword?: string
  status?: string
}

export interface ModelComparisonPayload {
  comparisonName: string
  prompt: string
  providerA?: string
  modelA?: string
  providerB?: string
  modelB?: string
  evaluationCriteria?: string
  createdBy?: string
}

export const fetchModelComparisons = (params: ModelComparisonQueryParams) =>
  request.get<ApiResponse<PageData<ModelComparison>>>('/system/model-comparisons', { params })

export const createModelComparison = (data: ModelComparisonPayload) =>
  request.post<ApiResponse<ModelComparison>>('/system/model-comparisons', data)

export const updateModelComparison = (id: number, data: ModelComparisonPayload) =>
  request.put<ApiResponse<ModelComparison>>(`/system/model-comparisons/${id}`, data)

export const deleteModelComparison = (id: number) =>
  request.delete<ApiResponse<void>>(`/system/model-comparisons/${id}`)

export const runModelComparison = (id: number) =>
  request.post<ApiResponse<ModelComparison>>(`/system/model-comparisons/${id}/run`)
