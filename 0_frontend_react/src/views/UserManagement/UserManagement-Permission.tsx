import React, { useEffect, useMemo, useState } from 'react'
import { Form, Input, InputNumber, Modal, Select, TreeSelect, message } from 'antd'
import TablePageLayout from '../../components/layouts/TablePageLayout'
import type { Permission, PermissionTreeNode, ActionButton as ActionButtonType, SearchItem, TableColumn } from '../../types'
import {
  fetchPermissions,
  fetchPermissionTree,
  createPermission,
  updatePermission,
  deletePermission,
  type PermissionPayload
} from '../../api/permission'

const typeOptions = [
  { label: '菜单', value: 'menu' },
  { label: '按钮', value: 'button' },
  { label: '接口', value: 'api' }
]

const PermissionManagement: React.FC = () => {
  const [searchForm, setSearchForm] = useState<{ permissionName?: string; permissionCode?: string; type?: string | '' }>({
    permissionName: '',
    permissionCode: '',
    type: ''
  })
  const [permissionList, setPermissionList] = useState<Permission[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [loading, setLoading] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [currentPermission, setCurrentPermission] = useState<Permission | null>(null)
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const [treeOptions, setTreeOptions] = useState<any[]>([])

  const searchItems: SearchItem[] = [
    { label: '权限名', prop: 'permissionName', type: 'input', placeholder: '请输入权限名' },
    { label: '权限编码', prop: 'permissionCode', type: 'input', placeholder: '请输入权限编码' },
    { label: '类型', prop: 'type', type: 'select', options: [{ label: '全部', value: '' }, ...typeOptions] }
  ]

  const actionButtons: ActionButtonType[] = [
    { name: 'add', label: '新增权限', type: 'primary' },
    { name: 'refresh', label: '刷新', type: 'default' }
  ]

  const tableColumns: TableColumn[] = useMemo(() => ([
    { prop: 'permissionName', label: '权限名' },
    { prop: 'permissionCode', label: '权限编码' },
    {
      prop: 'type',
      label: '类型',
      formatter: (row: Permission) => typeOptions.find((item) => item.value === row.type)?.label || row.type
    },
    { prop: 'path', label: '路径' },
    { prop: 'method', label: '方法' },
    { prop: 'sort', label: '排序' },
    { prop: 'createTime', label: '创建时间' }
  ]), [])

  const tableActions: ActionButtonType[] = [
    { name: 'edit', label: '编辑', type: 'link' },
    { name: 'delete', label: '删除', type: 'link' }
  ]

  useEffect(() => {
    loadPermissions()
  }, [pagination.current, pagination.pageSize, searchForm])

  useEffect(() => {
    loadPermissionTree()
  }, [])

  const loadPermissions = async () => {
    setLoading(true)
    try {
      const res = await fetchPermissions({
        page: pagination.current,
        pageSize: pagination.pageSize,
        permissionName: searchForm.permissionName,
        permissionCode: searchForm.permissionCode,
        type: searchForm.type
      })
      const pageData = res.data
      setPermissionList(pageData?.list || [])
      setPagination((prev) => ({ ...prev, total: pageData?.total || 0 }))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const loadPermissionTree = async () => {
    try {
      const res = await fetchPermissionTree()
      setTreeOptions(buildTreeOptions(res.data || []))
    } catch (error) {
      console.error(error)
    }
  }

  const buildTreeOptions = (nodes: PermissionTreeNode[]): any[] =>
    nodes.map((node) => ({
      title: `${node.permissionName} (${node.permissionCode})`,
      value: node.id,
      children: node.children ? buildTreeOptions(node.children) : undefined
    }))

  const handleSearch = (data: Record<string, any>) => {
    setSearchForm({
      permissionName: data.permissionName || '',
      permissionCode: data.permissionCode || '',
      type: data.type ?? ''
    })
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleReset = () => {
    setSearchForm({ permissionName: '', permissionCode: '', type: '' })
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const openCreateModal = () => {
    setFormMode('create')
    setCurrentPermission(null)
    form.resetFields()
    setFormVisible(true)
  }

  const openEditModal = (record: Permission) => {
    setFormMode('edit')
    setCurrentPermission(record)
    form.resetFields()
    form.setFieldsValue({
      permissionName: record.permissionName,
      permissionCode: record.permissionCode,
      type: record.type,
      parentId: record.parentId,
      path: record.path,
      method: record.method,
      sort: record.sort
    })
    setFormVisible(true)
  }

  const handleAction = (action: string) => {
    if (action === 'add') {
      openCreateModal()
    }
    if (action === 'refresh') {
      loadPermissions()
      loadPermissionTree()
    }
  }

  const handleTableAction = (action: string, record: Permission) => {
    if (action === 'edit') {
      openEditModal(record)
    }
    if (action === 'delete') {
      Modal.confirm({
        title: '确认删除',
        content: `确定删除权限 ${record.permissionName} 吗？`,
        onOk: async () => {
          try {
            await deletePermission(record.id)
            message.success('删除成功')
            loadPermissions()
            loadPermissionTree()
          } catch (error) {
            console.error(error)
          }
        }
      })
    }
  }

  const submitForm = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)
      if (formMode === 'create') {
        await createPermission(values as PermissionPayload)
        message.success('权限创建成功')
      } else if (currentPermission) {
        await updatePermission(currentPermission.id, values as PermissionPayload)
        message.success('权限更新成功')
      }
      setFormVisible(false)
      loadPermissions()
      loadPermissionTree()
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePagination = (page: number, size: number) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize: size }))
  }

  const renderPermissionForm = () => (
    <Form form={form} layout="vertical">
      <Form.Item
        name="permissionName"
        label="权限名称"
        rules={[{ required: true, message: '请输入权限名称' }]}
      >
        <Input placeholder="请输入权限名称" />
      </Form.Item>
      <Form.Item
        name="permissionCode"
        label="权限编码"
        rules={[{ required: true, message: '请输入权限编码' }]}
      >
        <Input placeholder="请输入权限编码" disabled={formMode === 'edit'} />
      </Form.Item>
      <Form.Item
        name="type"
        label="权限类型"
        rules={[{ required: true, message: '请选择权限类型' }]}
      >
        <Select options={typeOptions} placeholder="请选择权限类型" />
      </Form.Item>
      <Form.Item name="parentId" label="上级权限">
        <TreeSelect
          placeholder="请选择上级权限"
          allowClear
          treeData={treeOptions}
          treeDefaultExpandAll
        />
      </Form.Item>
      <Form.Item name="path" label="访问路径">
        <Input placeholder="请输入访问路径" />
      </Form.Item>
      <Form.Item name="method" label="请求方式">
        <Input placeholder="GET/POST/PUT..." />
      </Form.Item>
      <Form.Item name="sort" label="排序">
        <InputNumber placeholder="请输入排序" style={{ width: '100%' }} />
      </Form.Item>
    </Form>
  )

  return (
    <>
      <TablePageLayout
        title="权限管理"
        searchItems={searchItems}
        initialFormData={searchForm}
        onSearch={handleSearch}
        onReset={handleReset}
        actionButtons={actionButtons}
        onAction={handleAction}
        tableData={permissionList}
        tableColumns={tableColumns}
        loading={loading}
        showSelection={false}
        showTableAction={true}
        tableActions={tableActions}
        rowKey="id"
        onTableAction={handleTableAction}
        total={pagination.total}
        current={pagination.current}
        pageSize={pagination.pageSize}
        onPagination={handlePagination}
      />

      <Modal
        open={formVisible}
        title={formMode === 'create' ? '新增权限' : '编辑权限'}
        onCancel={() => setFormVisible(false)}
        onOk={submitForm}
        confirmLoading={submitting}
        destroyOnClose
        width={520}
      >
        {renderPermissionForm()}
      </Modal>
    </>
  )
}

export default PermissionManagement
