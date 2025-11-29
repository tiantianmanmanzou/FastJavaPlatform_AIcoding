import React, { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { message, Modal, Card, Tag, Space, Typography } from '@ui'
import FilterBarTablePageLayout from '../../components/layouts/FilterBarTablePageLayout'
import type { SearchItem, ActionButton, TableColumn } from '../../types'
import type { ProductItem } from '../../types'
import ProductFormModal, { type ProductFormState } from './ProductFormModal'
import { fetchProducts, fetchSimpleProducts, createProduct, updateProduct, deleteProduct } from '../../api/product'
import './ProductManagementPage.scss'

const { Text } = Typography

const statusColors: Record<number, { text: string; color: string }> = {
  1: { text: '启用', color: '#10b981' },
  0: { text: '停用', color: '#f97316' }
}

const ProductManagementPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<ProductItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState({ keyword: '', productType: '', status: '' })
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ProductItem | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [productTypeOptions, setProductTypeOptions] = useState<string[]>([])

  const searchItems: SearchItem[] = useMemo(() => [
    { type: 'input', label: '产品关键词', prop: 'keyword', placeholder: '产品名称/描述' },
    { type: 'input', label: '产品类型', prop: 'productType', placeholder: '例如：数码 / 美妆' },
    {
      type: 'select',
      label: '状态',
      prop: 'status',
      placeholder: '全部状态',
      options: [
        { label: '全部', value: '' },
        { label: '启用', value: 1 },
        { label: '停用', value: 0 }
      ]
    }
  ], [])

  const actionButtons: ActionButton[] = useMemo(
    () => [
      { name: 'add', label: '新增产品', type: 'primary' }
    ],
    []
  )

  const tableColumns: TableColumn[] = useMemo(
    () => [
      {
        prop: 'productName',
        label: '产品',
        minWidth: 200,
        formatter: (row: ProductItem) => (
          <div className="product-name-cell">
            <Text strong>{row.productName}</Text>
            <span className="product-code">{row.productCode}</span>
          </div>
        )
      },
      {
        prop: 'productType',
        label: '类型',
        width: 120
      },
      {
        prop: 'tags',
        label: '标签',
        minWidth: 200,
        formatter: (row: ProductItem) => (
          <div className="product-tags-cell">
            {row.tags && row.tags.length > 0
              ? row.tags.map((tag) => (
                  <Tag key={`${row.id}-${tag}`} color="#e0f2fe">
                    <span className="tag-text">{tag}</span>
                  </Tag>
                ))
              : <span className="text-slate-400">未配置</span>}
          </div>
        )
      },
      {
        prop: 'status',
        label: '状态',
        width: 100,
        formatter: (row: ProductItem) => {
          const status = statusColors[row.status] || { text: '未知', color: '#94a3b8' }
          return <span style={{ color: status.color, fontWeight: 600 }}>{status.text}</span>
        }
      },
      {
        prop: 'updateTime',
        label: '更新时间',
        width: 160,
        formatter: (row: ProductItem) => dayjs(row.updateTime).format('YYYY-MM-DD HH:mm')
      }
    ],
    []
  )

  const tableActions: ActionButton[] = useMemo(
    () => [
      { name: 'edit', label: '编辑', type: 'link' },
      { name: 'delete', label: '删除', type: 'link' }
    ],
    []
  )

  const fetchProductTypes = useCallback(async () => {
    try {
      const res = await fetchSimpleProducts()
      const items = res.data || []
      const uniqueTypes = Array.from(new Set(items.map((item) => item.productType).filter(Boolean)))
      setProductTypeOptions(uniqueTypes as string[])
    } catch (error) {
      console.error(error)
    }
  }, [])

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

  useEffect(() => {
    fetchProductTypes()
  }, [fetchProductTypes])

  const handleSearch = useCallback((formData: Record<string, any>) => {
    setFilters({
      keyword: formData.keyword || '',
      productType: formData.productType || '',
      status: formData.status ?? ''
    })
    setPage(1)
  }, [])

  const handleAction = useCallback((action: string) => {
    if (action === 'add') {
      setEditing(null)
      setModalOpen(true)
    }
  }, [])

  const openEditModal = (record: ProductItem) => {
    setEditing(record)
    setModalOpen(true)
  }

  const handleTableAction = (action: string, record: ProductItem) => {
    if (action === 'edit') {
      openEditModal(record)
    } else if (action === 'delete') {
      Modal.confirm({
        title: '确认删除该产品？',
        content: `删除后将无法在内容创作中使用【${record.productName}】`,
        onOk: async () => {
          try {
            await deleteProduct(record.id)
            message.success('产品已删除')
            fetchList()
          } catch (error) {
            console.error(error)
          }
        }
      })
    }
  }

  const handleSubmit = async (values: ProductFormState) => {
    try {
      setSubmitting(true)
      if (editing) {
        await updateProduct(editing.id, values)
        message.success('产品已更新')
      } else {
        await createProduct(values)
        message.success('产品已创建')
      }
      setModalOpen(false)
      setEditing(null)
      fetchList()
      fetchProductTypes()
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePagination = (nextPage: number, nextSize: number) => {
    setPage(nextPage)
    setPageSize(nextSize)
  }

  const filterContent = (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card size="small" title="状态概览">
        <Space direction="vertical" style={{ width: '100%' }}>
          {Object.entries(statusColors).map(([key, meta]) => {
            const count = products.filter((item) => Number(key) === item.status).length
            return (
              <div key={key} className="flex justify-between text-sm">
                <span>{meta.text}</span>
                <span style={{ color: meta.color }}>{count} 个</span>
              </div>
            )
          })}
        </Space>
      </Card>
      {productTypeOptions.length > 0 && (
        <Card size="small" title="常见类型">
          <div className="product-type-tags">
            {productTypeOptions.map((type) => (
              <Tag key={type} color="#ecfccb" onClick={() => handleSearch({ ...filters, productType: type })}>
                {type}
              </Tag>
            ))}
          </div>
        </Card>
      )}
    </Space>
  )

  return (
    <div className="product-management-page">
      <FilterBarTablePageLayout
        title="产品管理"
        showSearch
        searchItems={searchItems}
        initialFormData={filters}
        onSearch={handleSearch}
        showAction
        actionButtons={actionButtons}
        onAction={handleAction}
        tableData={products}
        tableColumns={tableColumns}
        tableActions={tableActions}
        onTableAction={handleTableAction}
        loading={loading}
        total={total}
        current={page}
        pageSize={pageSize}
        onPagination={handlePagination}
        filterContent={filterContent}
      />

      <ProductFormModal
        open={modalOpen}
        loading={submitting}
        initialValues={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default ProductManagementPage
