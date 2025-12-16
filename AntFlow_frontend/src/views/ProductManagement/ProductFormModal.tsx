import React, { useEffect, useMemo, useRef, useState } from 'react'
import { message } from '@/lib/message'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem
} from '@/components/ui/select'
import type { ProductImage, ProductItem } from '../../types'

interface ProductFormModalProps {
  open: boolean
  loading?: boolean
  initialValues?: ProductItem | null
  onClose: () => void
  onSubmit: (values: ProductFormState) => Promise<void>
}

export interface ProductFormState {
  productName: string
  productType: string
  description?: string
  tags?: string[]
  status?: number
  productCode?: string
  images?: ProductImage[]
}

const defaultValues: ProductFormState = {
  productName: '',
  productType: '',
  description: '',
  tags: [],
  status: 1,
  images: []
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ open, loading, initialValues, onClose, onSubmit }) => {
  const [formState, setFormState] = useState<Record<string, any>>({ ...defaultValues, tagsText: '', images: [] })
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [newImageUrl, setNewImageUrl] = useState('')

  const mergedInitial = useMemo(() => {
    if (!initialValues) {
      return { ...defaultValues, tagsText: '', images: [] }
    }
    return {
      productName: initialValues.productName,
      productType: initialValues.productType,
      description: initialValues.description,
      status: initialValues.status ?? 1,
      productCode: initialValues.productCode,
      tagsText: initialValues.tags?.join(',') ?? '',
      images: initialValues.images ? initialValues.images.map((img) => ({ ...img })) : []
    }
  }, [initialValues])

  useEffect(() => {
    if (open) {
      setFormState(mergedInitial)
      setNewImageUrl('')
    }
  }, [open, mergedInitial])

  const handleChange = (field: string, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const updateImages = (updater: (images: ProductImage[]) => ProductImage[]) => {
    setFormState((prev) => {
      const currentImages: ProductImage[] = Array.isArray(prev.images) ? prev.images : []
      return { ...prev, images: updater(currentImages) }
    })
  }

  const ensurePrimary = (images: ProductImage[]) => {
    if (images.length === 0) return images
    const next = images.map((img, idx) => ({ ...img }))
    if (!next.some((img) => img.primary)) {
      next[0].primary = true
    }
    return next
  }

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const conversions = Array.from(files).map((file) => fileToBase64(file))
    const base64List = await Promise.all(conversions)
    updateImages((prev) => {
      const next = [...prev, ...base64List.map((imageUrl) => ({ imageUrl }))]
      return ensurePrimary(next)
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) {
      message.warning('请输入图片URL或上传文件')
      return
    }
    updateImages((prev) => ensurePrimary([...prev, { imageUrl: newImageUrl.trim() }]))
    setNewImageUrl('')
  }

  const handleRemoveImage = (index: number) => {
    updateImages((prev) => {
      const next = [...prev]
      next.splice(index, 1)
      return ensurePrimary(next)
    })
  }

  const handleSetPrimaryImage = (index: number) => {
    updateImages((prev) => prev.map((img, idx) => ({ ...img, primary: idx === index })))
  }

  const handleSubmit = async () => {
    if (!formState.productName?.trim()) {
      message.error('请输入产品名称')
      return
    }
    if (!formState.productType?.trim()) {
      message.error('请输入产品类型')
      return
    }
    const payload: ProductFormState = {
      productName: formState.productName.trim(),
      productType: formState.productType.trim(),
      description: formState.description || '',
      status: formState.status === '' ? undefined : Number(formState.status ?? 1),
      productCode: formState.productCode || '',
      tags: formState.tagsText
        ? String(formState.tagsText)
          .split(',')
          .map((item: string) => item.trim())
          .filter(Boolean)
        : [],
      images: Array.isArray(formState.images)
        ? ensurePrimary(formState.images.map((img: ProductImage, index: number) => ({
            ...img,
            primary: img.primary ?? index === 0
          })))
        : []
    }
    await onSubmit(payload)
  }

  const images: ProductImage[] = Array.isArray(formState.images) ? formState.images : []

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose() }}>
      <DialogContent className="max-w-2xl" onInteractOutside={(event) => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{initialValues ? '编辑产品' : '新增产品'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800">产品名称</label>
              <Input
                placeholder="例如：智能按摩仪"
                value={formState.productName}
                maxLength={60}
                onChange={(e) => handleChange('productName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800">产品类型</label>
              <Input
                placeholder="例如：智能硬件 / 个护"
                value={formState.productType}
                maxLength={30}
                onChange={(e) => handleChange('productType', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">产品描述</label>
            <Textarea
              rows={3}
              maxLength={200}
              placeholder="简要描述产品卖点，控制在200字以内"
              value={formState.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">产品图</label>
            <div className="space-y-3 rounded-lg border border-dashed border-slate-200 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  上传图片
                </Button>
                <div className="flex w-full flex-1 items-center gap-2">
                  <Input placeholder="或粘贴图片URL" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
                  <Button type="button" variant="ghost" onClick={handleAddImageUrl}>
                    添加
                  </Button>
                </div>
              </div>
              {images.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-sm text-slate-500">
                  暂无产品图，点击“上传图片”或粘贴图片URL新增
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {images.map((image, index) => (
                    <div key={image.id || image.imageUrl + index} className="relative rounded-lg border border-slate-200 p-2">
                      {image.primary && (
                        <span className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-xs text-white">
                          主图
                        </span>
                      )}
                      <img src={image.imageUrl} alt={image.imageUrl} className="h-36 w-full rounded-lg object-cover" />
                      <div className="mt-2 flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => handleSetPrimaryImage(index)} disabled={image.primary}>
                          设为主图
                        </Button>
                        <Button type="button" variant="ghost" size="sm" className="text-rose-500" onClick={() => handleRemoveImage(index)}>
                          删除
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">标签</label>
            <Input
              placeholder="多个标签使用逗号分隔，例如：新品,爆款"
              value={formState.tagsText}
              onChange={(e) => handleChange('tagsText', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800">状态</label>
              <Select
                value={
                  typeof formState.status === 'number'
                    ? String(formState.status)
                    : undefined
                }
                onValueChange={(value) => handleChange('status', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">启用</SelectItem>
                  <SelectItem value="0">停用</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800">产品编码</label>
              <Input
                placeholder="留空系统自动生成"
                value={formState.productCode}
                onChange={(e) => handleChange('productCode', e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProductFormModal

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}
