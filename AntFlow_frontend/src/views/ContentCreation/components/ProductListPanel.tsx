import React, { useMemo, useState } from 'react'
import { Input, Empty } from '@ui'
import type { ProductSimpleItem } from '../../../types'

interface ProductListPanelProps {
  products: ProductSimpleItem[]
  selectedId?: number | null
  onSelect: (id: number) => void
  extraAction?: React.ReactNode
}

const ProductListPanel: React.FC<ProductListPanelProps> = ({ products, selectedId, onSelect, extraAction }) => {
  const [keyword, setKeyword] = useState('')

  const filtered = useMemo(() => {
    if (!keyword) return products
    return products.filter((item) =>
      item.productName.toLowerCase().includes(keyword.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(keyword.toLowerCase())
    )
  }, [keyword, products])

  return (
    <div className="cc-product-panel">
      <div className="cc-panel-header">
        <h4>产品列表</h4>
        {extraAction}
      </div>
      <Input
        allowClear
        placeholder="搜索产品"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ marginBottom: 12 }}
      />
      <div className="cc-product-list">
        {filtered.length === 0 && <Empty description="暂无产品" />}
        {filtered.map((product) => (
          <div
            key={product.id}
            className={`cc-product-card ${selectedId === product.id ? 'active' : ''}`}
            onClick={() => onSelect(product.id)}
          >
            <div className="cc-product-title">{product.productName}</div>
            <div className="cc-product-meta">{product.productType || '未分类'}</div>
            <div className="cc-product-desc">{product.description || '暂无描述'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductListPanel
