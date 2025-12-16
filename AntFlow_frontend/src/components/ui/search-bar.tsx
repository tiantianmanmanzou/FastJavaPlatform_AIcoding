import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'

export interface SearchField {
  key: string
  type: 'input' | 'select' | 'date' | 'dateRange'
  placeholder?: string
  options?: Array<{ label: string; value: string }>
  label?: string
}

export interface SearchBarProps {
  fields: SearchField[]
  values: Record<string, string>
  onValuesChange: (values: Record<string, string>) => void
  onSearch: () => void
  onReset: () => void
  loading?: boolean
  actions?: React.ReactNode
}

const SearchBar: React.FC<SearchBarProps> = ({
  fields,
  values,
  onValuesChange,
  onSearch,
  onReset,
  loading = false,
  actions
}) => {
  const handleFieldChange = (key: string, value: string) => {
    onValuesChange({
      ...values,
      [key]: value
    })
  }

  return (
    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {fields.map((field) => {
          const value = values[field.key] ?? ''
          const isSelectField = field.type === 'select'
          const isDateField = field.type === 'date'
          const isDateRangeField = field.type === 'dateRange'

          if (isDateRangeField) {
            const startKey = `${field.key}Start`
            const endKey = `${field.key}End`
            return (
              <div key={field.key} className="flex w-full gap-2 md:w-auto">
                <Input
                  type="date"
                  value={values[startKey] ?? ''}
                  onChange={(e) => handleFieldChange(startKey, e.target.value)}
                  className="w-full md:w-32"
                />
                <Input
                  type="date"
                  value={values[endKey] ?? ''}
                  onChange={(e) => handleFieldChange(endKey, e.target.value)}
                  className="w-full md:w-32"
                />
              </div>
            )
          }

          return (
            <div key={field.key} className="w-full md:w-auto">
              {isSelectField ? (
                <Select
                  value={value === '' ? 'all' : value}
                  onValueChange={(newValue) => {
                    handleFieldChange(field.key, newValue === 'all' ? '' : newValue)
                  }}
                >
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder={field.placeholder || '全部'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : isDateField ? (
                <Input
                  type="date"
                  placeholder={field.placeholder}
                  value={value}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  className="w-full md:w-40"
                />
              ) : (
                <Input
                  placeholder={field.placeholder}
                  value={value}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  className="w-full md:w-48"
                />
              )}
            </div>
          )
        })}
        <Button type="button" onClick={onSearch} disabled={loading}>
          {loading ? '查询中...' : '搜索'}
        </Button>
        <Button type="button" variant="outline" onClick={onReset} disabled={loading}>
          重置
        </Button>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export default SearchBar
