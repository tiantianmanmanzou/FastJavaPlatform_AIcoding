import React, { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import PageContainer from '@/components/ui/page-container'
import PageHeader from '@/components/ui/page-header'
import { message } from '@/lib/message'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import ConfirmPopover from '@/components/ui/confirm-popover'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table'
import SearchBar, { type SearchField } from '@/components/ui/search-bar'
import type { ProductImage, ProductItem } from '../../types'
import ProductFormModal, { type ProductFormState } from './ProductFormModal'
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage
} from '../../api/product'

const statusColors: Record<number, { text: string; color: string }> = {
  1: { text: '启用', color: '#059669' },
  0: { text: '停用', color: '#ea580c' }
}

const ProductManagementPage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<ProductItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [filters, setFilters] = useState({ keyword: '', productType: '', status: '' })
  const [searchForm, setSearchForm] = useState({ keyword: '', productType: '', status: '' })
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ProductItem | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fetchList = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchProducts({
        page,
        pageSize,
        keyword: filters.keyword,
        productType: filters.productType,
        status: filters.status === '' ? undefined : Number(filters.status)
      })
      setProducts(res.data.list)
      setTotal(res.data.total)
    } catch (error) {
      // error handled globally
    } finally {
      setLoading(false)
    }
  }, [filters.keyword, filters.productType, filters.status, page, pageSize])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  const mapFormToPayload = (values: ProductFormState) => {
    const imagePayload = values.images && values.images.length > 0
      ? values.images.map((img, index) => ({
          imageUrl: img.imageUrl,
          primary: img.primary ?? index === 0
        }))
      : []
    return { ...values, images: imagePayload }
  }

  const handleSearch = useCallback(() => {
    setPage(1)
    setFilters(searchForm)
  }, [searchForm])

  const handleReset = () => {
    setSearchForm({ keyword: '', productType: '', status: '' })
    setFilters({ keyword: '', productType: '', status: '' })
    setPage(1)
  }

  const openEditModal = (record: ProductItem) => {
    setEditing(record)
    setModalOpen(true)
  }

  const handleDeleteProduct = async (record: ProductItem) => {
    try {
      await deleteProduct(record.id)
      message.success('产品已删除')
      fetchList()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteImage = async (productId: number, image: ProductImage) => {
    if (!image.id) {
      message.error('图片信息缺失，无法删除')
      return
    }
    try {
      await deleteProductImage(productId, image.id)
      message.success('产品图已删除')
      fetchList()
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (values: ProductFormState) => {
    try {
      setSubmitting(true)
      const payload = mapFormToPayload(values)
      if (editing) {
        await updateProduct(editing.id, payload)
        message.success('产品已更新')
      } else {
        await createProduct(payload)
        message.success('产品已创建')
      }
      setModalOpen(false)
      setEditing(null)
      fetchList()
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pagedProducts = products

  const searchFields: SearchField[] = [
    { key: 'keyword', type: 'input', placeholder: '搜索产品名称/描述' },
    { key: 'productType', type: 'input', placeholder: '搜索产品类型' },
    {
      key: 'status',
      type: 'select',
      placeholder: '全部状态',
      options: [
        { label: '启用', value: '1' },
        { label: '停用', value: '0' }
      ]
    }
  ]

  const renderStatus = (record: ProductItem) => {
    const meta = statusColors[record.status] || { text: '未知', color: '#94a3b8' }
    return <span style={{ color: meta.color, fontWeight: 600 }}>{meta.text}</span>
  }

  const renderImages = (record: ProductItem) => {
    const imgs = record.images || []
    if (imgs.length === 0) {
      return <span className="text-xs text-slate-400">未上传</span>
    }
    const visible = imgs.slice(0, 4)
    const remaining = imgs.length - visible.length
    return (
      <div className="flex flex-wrap items-center gap-2">
        {visible.map((img) => (
          <div key={`${record.id}-${img.id || img.imageUrl}`} className="group relative h-16 w-16">
            {img.primary && (
              <span className="absolute left-1 top-1 rounded bg-emerald-500 px-1 text-[10px] text-white">主</span>
            )}
            <img src={img.imageUrl} alt={record.productName} className="h-16 w-16 rounded object-cover" />
            <ConfirmPopover
              title="删除产品图"
              description="确定删除该图片吗？"
              onConfirm={() => handleDeleteImage(record.id, img)}
            >
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 hidden h-5 w-5 rounded-full bg-white/80 p-0 text-xs text-rose-500 group-hover:flex"
              >
                ×
              </Button>
            </ConfirmPopover>
          </div>
        ))}
        {remaining > 0 && <span className="text-xs text-slate-500">+{remaining}</span>}
      </div>
    )
  }

  const renderTags = (record: ProductItem) => {
    if (!record.tags || record.tags.length === 0) {
      return <span className="text-xs text-slate-400">未配置</span>
    }
    return (
      <div className="flex flex-wrap gap-2">
        {record.tags.map((tag) => (
          <Badge key={`${record.id}-${tag}`} variant="secondary" className="bg-slate-100 text-slate-600">
            {tag}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <PageContainer>
      <PageHeader title="产品管理" />

      <Card>
        <CardContent className="flex flex-col gap-4">
          <SearchBar
            fields={searchFields}
            values={searchForm}
            onValuesChange={setSearchForm}
            onSearch={handleSearch}
            onReset={handleReset}
            loading={loading}
            actions={<Button onClick={() => { setEditing(null); setModalOpen(true) }}>新增产品</Button>}
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-center">序号</TableHead>
                <TableHead>产品</TableHead>
                <TableHead className="w-44">产品图</TableHead>
                <TableHead className="w-32">类型</TableHead>
                <TableHead>标签</TableHead>
                <TableHead className="w-32 text-center">状态</TableHead>
                <TableHead className="w-48 text-center">更新时间</TableHead>
                <TableHead className="w-40 text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedProducts.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-slate-500">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
              {pagedProducts.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center text-slate-500">{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <button
                        type="button"
                        className="text-left font-semibold text-slate-900 hover:text-primary"
                        onClick={() => navigate(`/product-management/${item.id}`)}
                      >
                        {item.productName}
                      </button>
                      <span className="text-xs text-slate-500">{item.description || '暂无描述'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{renderImages(item)}</TableCell>
                  <TableCell>{item.productType || '-'}</TableCell>
                  <TableCell>{renderTags(item)}</TableCell>
                  <TableCell className="text-center">{renderStatus(item)}</TableCell>
                  <TableCell className="text-center text-sm text-slate-500">
                    {dayjs(item.updateTime).format('YYYY-MM-DD HH:mm')}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-3">
                      <Button variant="link" size="sm" className="px-0" onClick={() => openEditModal(item)}>
                        编辑
                      </Button>
                      <ConfirmPopover
                        title="删除产品"
                        description={`确认删除【${item.productName}】？删除后将无法在内容创作中使用该产品。`}
                        onConfirm={() => handleDeleteProduct(item)}
                      >
                        <Button variant="link" size="sm" className="px-0 text-rose-500">
                          删除
                        </Button>
                      </ConfirmPopover>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
            <span>第 {page} / {totalPages} 页</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1 || loading}>
                上一页
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page === totalPages || loading}>
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProductFormModal
        open={modalOpen}
        loading={submitting}
        initialValues={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  )
}

export default ProductManagementPage
