import request from '../utils/request'
import type { ApiResponse, PageData } from './types'
import type { ProductImage, ProductItem, ProductSimpleItem } from '../types'

export interface ProductQueryParams {
  page: number
  pageSize: number
  keyword?: string
  productType?: string
  status?: number | ''
}

export interface ProductImagePayload {
  imageUrl: string
  primary?: boolean
}

export interface ProductPayload {
  productName: string
  productType: string
  description?: string
  tags?: string[]
  status?: number
  productCode?: string
  images?: ProductImagePayload[]
}

export const fetchProducts = (params: ProductQueryParams) =>
  request.get<ApiResponse<PageData<ProductItem>>>('/products', { params })

export const fetchSimpleProducts = () =>
  request.get<ApiResponse<ProductSimpleItem[]>>('/products/simple')

export const fetchProductDetail = (id: number) =>
  request.get<ApiResponse<ProductItem>>(`/products/${id}`)

export const createProduct = (data: ProductPayload) =>
  request.post<ApiResponse<ProductItem>>('/products', data)

export const updateProduct = (id: number, data: ProductPayload) =>
  request.put<ApiResponse<ProductItem>>(`/products/${id}`, data)

export const deleteProduct = (id: number) =>
  request.delete<ApiResponse<void>>(`/products/${id}`)

export const addProductImages = (productId: number, images: ProductImagePayload[]) =>
  request.post<ApiResponse<ProductImage[]>>(`/products/${productId}/images`, images)

export const deleteProductImage = (productId: number, imageId: number) =>
  request.delete<ApiResponse<void>>(`/products/${productId}/images/${imageId}`)

export const setPrimaryProductImage = (productId: number, imageId: number) =>
  request.put<ApiResponse<ProductImage[]>>(`/products/${productId}/images/${imageId}/primary`)
