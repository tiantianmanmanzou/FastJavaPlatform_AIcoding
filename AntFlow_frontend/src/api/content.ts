import request from '../utils/request'
import type { ApiResponse } from './types'
import type {
  ContentModuleItem,
  ContentModuleType,
  ContentPlatform,
  ContentApiVendor,
  ContentTemplateItem
} from '../types'

export interface ContentModuleQueryParams {
  productId: number
  platform?: ContentPlatform
}

export interface ContentModuleCreatePayload {
  productId: number
  platform: ContentPlatform
  moduleType: ContentModuleType
  moduleTitle: string
  templateId?: number | null
  prompt?: string
  tone?: string
  style?: string
  contentLength?: string
  imageStyle?: string
  imageRatio?: string
  imageQuantity?: number
  videoStyle?: string
  videoRatio?: string
  videoDuration?: number
  apiVendor?: ContentApiVendor
  sortOrder?: number
}

export type ContentModuleUpdatePayload = Partial<Omit<ContentModuleCreatePayload, 'productId' | 'platform' | 'moduleType'>> & {
  moduleTitle: string
  status?: string
}

export interface ContentTemplateQueryParams {
  platform?: ContentPlatform
  moduleType?: ContentModuleType
}

export interface ContentTemplatePayload {
  templateName: string
  platform: ContentPlatform
  moduleType: ContentModuleType
  description?: string
  prompt?: string
  tone?: string
  style?: string
  contentLength?: string
  imageStyle?: string
  imageRatio?: string
  imageQuantity?: number
  videoStyle?: string
  videoRatio?: string
  videoDuration?: number
  apiVendor?: ContentApiVendor
}

export const fetchContentModules = (params: ContentModuleQueryParams) =>
  request.get<ApiResponse<ContentModuleItem[]>>('/content/modules', { params })

export const createContentModule = (data: ContentModuleCreatePayload) =>
  request.post<ApiResponse<ContentModuleItem>>('/content/modules', data)

export const updateContentModule = (id: number, data: ContentModuleUpdatePayload) =>
  request.put<ApiResponse<ContentModuleItem>>(`/content/modules/${id}`, data)

export const deleteContentModule = (id: number) =>
  request.delete<ApiResponse<void>>(`/content/modules/${id}`)

export const generateContentModule = (id: number) =>
  request.post<ApiResponse<ContentModuleItem>>(`/content/modules/${id}/generate`)

export const fetchContentTemplates = (params: ContentTemplateQueryParams) =>
  request.get<ApiResponse<ContentTemplateItem[]>>('/content/templates', { params })

export const createContentTemplate = (data: ContentTemplatePayload) =>
  request.post<ApiResponse<ContentTemplateItem>>('/content/templates', data)
