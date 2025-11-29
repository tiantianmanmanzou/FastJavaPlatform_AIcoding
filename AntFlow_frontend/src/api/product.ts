import request from '../utils/request'
import type { ApiResponse, PageData } from './types'
import type { ProductItem, ProductSimpleItem } from '../types'

export interface ProductQueryParams {
  page: number
  pageSize: number
  keyword?: string
  productType?: string
  status?: number | ''
}

export interface ProductPayload {
  productName: string
  productType: string
  description?: string
  coverImageUrl?: string
  originImageUrl?: string
  tags?: string[]
  status?: number
  productCode?: string
}

export const fetchProducts = (params: ProductQueryParams) =>
  request.get<ApiResponse<PageData<ProductItem>>>('/products', { params })

export const fetchSimpleProducts = () =>
  request.get<ApiResponse<ProductSimpleItem[]>>('/products/simple')

export const createProduct = (data: ProductPayload) =>
  request.post<ApiResponse<ProductItem>>('/products', data)

export const updateProduct = (id: number, data: ProductPayload) =>
  request.put<ApiResponse<ProductItem>>(`/products/${id}`, data)

export const deleteProduct = (id: number) =>
  request.delete<ApiResponse<void>>(`/products/${id}`)
