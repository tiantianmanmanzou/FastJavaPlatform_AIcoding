import React, { useEffect, useMemo } from 'react'
import { Modal, Form, Input, Select } from '@ui'
import type { ProductItem } from '../../types'

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
  coverImageUrl?: string
  originImageUrl?: string
  tags?: string[]
  status?: number
  productCode?: string
}

const defaultValues: ProductFormState = {
  productName: '',
  productType: '',
  description: '',
  coverImageUrl: '',
  originImageUrl: '',
  tags: [],
  status: 1
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ open, loading, initialValues, onClose, onSubmit }) => {
  const [form] = Form.useForm()

  const mergedInitial = useMemo(() => {
    if (!initialValues) {
      return { ...defaultValues, tagsText: '' }
    }
    return {
      productName: initialValues.productName,
      productType: initialValues.productType,
      description: initialValues.description,
      coverImageUrl: initialValues.coverImageUrl,
      originImageUrl: initialValues.originImageUrl,
      status: initialValues.status,
      productCode: initialValues.productCode,
      tagsText: initialValues.tags?.join(',') ?? ''
    }
  }, [initialValues])

  useEffect(() => {
    if (!open) return
    form.resetFields()
    form.setFieldsValue(mergedInitial)
  }, [open, mergedInitial, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    const payload: ProductFormState = {
      productName: values.productName,
      productType: values.productType,
      description: values.description,
      coverImageUrl: values.coverImageUrl,
      originImageUrl: values.originImageUrl,
      status: values.status === '' ? undefined : Number(values.status),
      productCode: values.productCode,
      tags: values.tagsText
        ? String(values.tagsText)
          .split(',')
          .map((item: string) => item.trim())
          .filter(Boolean)
        : []
    }
    await onSubmit(payload)
  }

  return (
    <Modal
      open={open}
      title={initialValues ? '编辑产品' : '新增产品'}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={loading}
      width={640}
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="产品名称" name="productName" required rules={[{ required: true, message: '请输入产品名称' }]}>
            <Input placeholder="例如：智能按摩仪" maxLength={60} showCount />
          </Form.Item>
          <Form.Item label="产品类型" name="productType" required rules={[{ required: true, message: '请输入产品类型' }]}>
            <Input placeholder="例如：智能硬件 / 个护" maxLength={30} />
          </Form.Item>
        </div>
        <Form.Item label="产品描述" name="description">
          <Input.TextArea rows={3} maxLength={200} showCount placeholder="简要描述产品卖点，控制在200字以内" />
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="展示图 URL" name="coverImageUrl">
            <Input placeholder="https://example.com/cover.png" allowClear />
          </Form.Item>
          <Form.Item label="原始图 URL" name="originImageUrl">
            <Input placeholder="https://example.com/raw.png" allowClear />
          </Form.Item>
        </div>
        <Form.Item label="标签" name="tagsText">
          <Input placeholder="多个标签请使用逗号分隔，例如：新品,爆款,直播同款" allowClear />
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="状态" name="status">
            <Select
              placeholder="请选择状态"
              options={[
                { label: '启用', value: 1 },
                { label: '停用', value: 0 }
              ]}
            />
          </Form.Item>
          <Form.Item label="产品编码" name="productCode" tooltip="不填写将自动生成">
            <Input placeholder="留空系统自动生成" allowClear />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

export default ProductFormModal
