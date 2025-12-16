import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ProductItem } from '../../types'

interface StatusMeta {
  text: string
  color: string
}

interface ProductSidebarProps {
  statusColors: Record<number, StatusMeta>
  products: ProductItem[]
  productTypeOptions: string[]
  onTypeSelect: (type: string) => void
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({ statusColors, products, productTypeOptions, onTypeSelect }) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">状态概览</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {Object.entries(statusColors).map(([key, meta]) => {
            const count = products.filter((item) => Number(key) === item.status).length
            return (
              <div
                key={key}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">{meta.text}</span>
                  <span className="text-xs text-slate-400">当前状态</span>
                </div>
                <span className="text-base font-semibold" style={{ color: meta.color }}>
                  {count} 个
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {productTypeOptions.length > 0 && (
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">常见类型</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {productTypeOptions.map((type) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                className="rounded-full border-dashed border-slate-300 text-xs font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-100"
                onClick={() => onTypeSelect(type)}
              >
                {type}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ProductSidebar
