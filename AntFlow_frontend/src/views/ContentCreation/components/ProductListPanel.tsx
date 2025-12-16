import React, { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { PackageSearch } from 'lucide-react'
import type { ProductSimpleItem } from '../../../types'

interface ProductListPanelProps {
  products: ProductSimpleItem[]
  selectedId?: number | null
  onSelect: (id: number) => void
}

const ProductListPanel: React.FC<ProductListPanelProps> = ({ products, selectedId, onSelect }) => {
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
      </div>
      <Input
        placeholder="搜索产品"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ marginBottom: 12 }}
      />
      <div className="cc-product-list">
        {filtered.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-10 text-sm text-slate-400">
            <PackageSearch className="mb-2 h-6 w-6" />
            暂无产品
          </div>
        )}
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
