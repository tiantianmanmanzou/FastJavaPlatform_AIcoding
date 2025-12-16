import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import PageHeader from '@/components/ui/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import ConfirmPopover from '@/components/ui/confirm-popover'
import { Spinner } from '@/components/ui/spinner'
import { message } from '@/lib/message'
import {
  addProductImages,
  deleteProductImage,
  fetchProductDetail,
  setPrimaryProductImage
} from '@/api/product'
import type { ProductImage, ProductItem } from '../../types'
import './ProductDetailPage.scss'

const ProductDetailPage: React.FC = () => {
  const { id } = useParams()
  const productId = Number(id)
  const navigate = useNavigate()
  const [product, setProduct] = useState<ProductItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [newImageUrl, setNewImageUrl] = useState('')

  const loadDetail = useCallback(async () => {
    if (!productId) return
    setLoading(true)
    try {
      const res = await fetchProductDetail(productId)
      setProduct(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    loadDetail()
  }, [loadDetail])

  const handleDeleteImage = async (image: ProductImage) => {
    if (!productId || !image.id) return
    try {
      await deleteProductImage(productId, image.id)
      message.success('图片已删除')
      loadDetail()
    } catch (error) {
      console.error(error)
    }
  }

  const handleSetPrimary = async (image: ProductImage) => {
    if (!productId || !image.id) return
    try {
      await setPrimaryProductImage(productId, image.id)
      message.success('已设为主图')
      loadDetail()
    } catch (error) {
      console.error(error)
    }
  }

  const handleFilesSelected = async (files: FileList | null) => {
    if (!productId || !files || files.length === 0) return
    setUploading(true)
    try {
      const base64List = await Promise.all(Array.from(files).map((file) => fileToBase64(file)))
      await addProductImages(
        productId,
        base64List.map((imageUrl, index) => ({ imageUrl, primary: !product?.images?.length && index === 0 }))
      )
      message.success('图片上传成功')
      loadDetail()
    } catch (error) {
      console.error(error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleAddImageUrl = async () => {
    if (!productId || !newImageUrl.trim()) {
      message.warning('请输入图片URL')
      return
    }
    setUploading(true)
    try {
      await addProductImages(productId, [{ imageUrl: newImageUrl.trim(), primary: !product?.images?.length }])
      message.success('图片已添加')
      setNewImageUrl('')
      loadDetail()
    } catch (error) {
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  if (!productId) {
    return (
      <div className="product-detail-page space-y-6">
        <PageHeader title="产品详情" extra={<Button variant="outline" onClick={() => navigate('/product-management')}>返回列表</Button>} />
        <div className="rounded-lg border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
          未找到产品ID
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-page space-y-6">
      <PageHeader
        title="产品详情"
        extra={<Button variant="outline" onClick={() => navigate('/product-management')}>返回列表</Button>}
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : !product ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-slate-500">未找到产品信息</CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">{product.productName}</h2>
                  <p className="text-sm text-slate-500">产品编码：{product.productCode}</p>
                </div>
                <Badge className={product.status === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}>
                  {product.status === 1 ? '启用' : '停用'}
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-xs text-slate-500">产品类型</div>
                  <div className="text-base text-slate-900">{product.productType}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">更新时间</div>
                  <div className="text-base text-slate-900">{product.updateTime ? dayjs(product.updateTime).format('YYYY-MM-DD HH:mm') : '-'}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">产品描述</div>
                <p className="text-sm text-slate-700">{product.description || '暂无描述'}</p>
              </div>
              <div>
                <div className="text-xs text-slate-500">标签</div>
                {product.tags && product.tags.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-slate-400">未配置</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-medium text-slate-900">产品图</h3>
                  <p className="text-sm text-slate-500">共 {product.images?.length || 0} 张</p>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFilesSelected(e.target.files)}
                  />
                  <Button type="button" variant="outline" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                    {uploading ? '上传中...' : '上传图片'}
                  </Button>
                  <div className="flex items-center gap-2">
                    <Input placeholder="或粘贴图片URL" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
                    <Button type="button" variant="ghost" onClick={handleAddImageUrl} disabled={uploading}>
                      添加
                    </Button>
                  </div>
                </div>
              </div>
              {product.images && product.images.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-3">
                  {product.images.map((image) => (
                    <div key={image.id || image.imageUrl} className="relative rounded-lg border border-slate-200 p-3">
                      {image.primary && (
                        <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2 py-0.5 text-xs text-white">主图</span>
                      )}
                      <img src={image.imageUrl} alt={product.productName} className="h-48 w-full rounded object-cover" />
                      <div className="mt-3 flex gap-2">
                        <Button type="button" variant="outline" size="sm" disabled={image.primary} onClick={() => handleSetPrimary(image)}>
                          设为主图
                        </Button>
                        <ConfirmPopover title="删除图片" description="确认删除该图片？" onConfirm={() => handleDeleteImage(image)}>
                          <Button type="button" variant="ghost" size="sm" className="text-rose-500">
                            删除
                          </Button>
                        </ConfirmPopover>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
                  暂无产品图
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

export default ProductDetailPage

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}
