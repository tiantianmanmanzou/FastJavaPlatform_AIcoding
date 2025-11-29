import React, { useState, useEffect, useRef } from 'react'
import { Form, Input, Select, DatePicker, Button, Space } from '@ui'
import { DownOutlined } from '@ui/icons'
import '../../styles/SearchBar.scss'

const { RangePicker } = DatePicker

interface SearchItem {
  prop: string
  label: string
  type: 'input' | 'select' | 'date' | 'daterange'
  placeholder?: string | string[]
  startPlaceholder?: string
  endPlaceholder?: string
  options?: { label: string; value: any }[]
  dateType?: string
  format?: string
  valueFormat?: string
}

interface SearchBarProps {
  searchItems: SearchItem[]
  initialFormData?: Record<string, any>
  onSearch: (data: Record<string, any>) => void
  onReset: () => void
  className?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchItems,
  initialFormData,
  onSearch,
  onReset,
  className
}) => {
  const [form] = Form.useForm()
  const [moreOpen, setMoreOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!initialFormData) return
    form.setFieldsValue(initialFormData)
  }, [initialFormData, form])

  const handleSearch = () => {
    const values = form.getFieldsValue()
    onSearch(values)
  }

  const handleReset = () => {
    form.resetFields()
    onReset()
  }

  const getStartPlaceholder = (item: SearchItem) => {
    if (item.startPlaceholder) return item.startPlaceholder
    if (Array.isArray(item.placeholder) && item.placeholder.length > 0) {
      return item.placeholder[0]
    }
    return '开始时间'
  }

  const getEndPlaceholder = (item: SearchItem) => {
    if (item.endPlaceholder) return item.endPlaceholder
    if (Array.isArray(item.placeholder) && item.placeholder.length > 1) {
      return item.placeholder[1]
    }
    return '结束时间'
  }

  const renderFormItem = (item: SearchItem) => {
    const basePlaceholder = typeof item.placeholder === 'string' ? item.placeholder : `请输入${item.label}`
    switch (item.type) {
      case 'input':
        return (
          <Input
            placeholder={basePlaceholder}
            allowClear
          />
        )
      case 'select':
        return (
          <Select
            placeholder={basePlaceholder}
            allowClear
            options={item.options}
          />
        )
      case 'date':
        return (
          <DatePicker
            placeholder={basePlaceholder}
            format={item.format}
            allowClear
          />
        )
      case 'daterange':
        return (
          <RangePicker
            placeholder={[getStartPlaceholder(item), getEndPlaceholder(item)]}
            format={item.format || 'YYYY-MM-DD'}
            allowClear
          />
        )
      default:
        return <Input />
    }
  }

  return (
    <div className={`search-bar ${className || ''}`} ref={containerRef}>
      <Form
        form={form}
        layout="inline"
        className="search-form"
      >
        <div className={`search-fields ${moreOpen ? 'expanded' : ''}`}>
          {searchItems.map((item, index) => {
            const isHidden = !moreOpen && index >= 4
            return (
              <Form.Item key={item.prop} name={item.prop} className={isHidden ? 'hidden-field' : ''}>
            {renderFormItem(item)}
          </Form.Item>
            )
          })}
        </div>
        <div className="search-actions">
          {searchItems.length > 4 && (
            <Button type="link" onClick={() => setMoreOpen(!moreOpen)} className="toggle-btn">
              {moreOpen ? '收起' : '更多筛选'}
              <DownOutlined
                style={{
                  marginLeft: '4px',
                  transform: moreOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}
              />
            </Button>
          )}
          <Space size={8}>
            <Button type="primary" onClick={handleSearch} size="small">
              搜索
            </Button>
            <Button onClick={handleReset} size="small">
              重置
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  )
}

export default SearchBar
