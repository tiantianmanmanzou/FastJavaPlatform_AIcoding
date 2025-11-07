import React, { useEffect, useMemo, useState } from 'react'
import { Form, Input, Modal, Select, Tree, message, Spin } from 'antd'
import type { DataNode } from 'antd/es/tree'
import TablePageLayout from '../../components/layouts/TablePageLayout'
import type { Role, ActionButton as ActionButtonType, SearchItem, TableColumn, PermissionTreeNode } from '../../types'
import {
  fetchRoles,
  fetchRoleDetail,
  createRole,
  updateRole,
  deleteRole,
  assignRolePermissions,
  type RolePayload
} from '../../api/role'
import { fetchPermissionTree } from '../../api/permission'

const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 }
]

const roleStatusOptions = statusOptions.filter((item) => item.value !== '') as Array<{ label: string; value: number }>

const RoleManagement: React.FC = () => {
  const [searchForm, setSearchForm] = useState<{ roleName?: string; status?: number | '' }>({
    roleName: '',
    status: ''
  })
  const [roleList, setRoleList] = useState<Role[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [loading, setLoading] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [currentRole, setCurrentRole] = useState<Role | null>(null)
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [permissionTree, setPermissionTree] = useState<DataNode[]>([])
  const [permissionLoading, setPermissionLoading] = useState(false)
  const [checkedPermissions, setCheckedPermissions] = useState<React.Key[]>([])
  const [permissionSubmitting, setPermissionSubmitting] = useState(false)

  const searchItems: SearchItem[] = [
    {
      label: '角色名',
      prop: 'roleName',
      type: 'input',
      placeholder: '请输入角色名'
    },
    {
      label: '状态',
      prop: 'status',
      type: 'select',
      options: statusOptions
    }
  ]

  const actionButtons: ActionButtonType[] = [
    { name: 'add', label: '新增角色', type: 'primary' },
    { name: 'refresh', label: '刷新', type: 'default' }
  ]

  const tableColumns: TableColumn[] = useMemo(() => ([
    { prop: 'roleName', label: '角色名' },
    { prop: 'roleCode', label: '角色编码' },
    { prop: 'description', label: '描述' },
    {
      prop: 'status',
      label: '状态',
      formatter: (row: Role) => (row.status === 1 ? '启用' : '禁用')
    },
    { prop: 'createTime', label: '创建时间' }
  ]), [])

  const tableActions: ActionButtonType[] = [
    { name: 'edit', label: '编辑', type: 'link' },
    { name: 'permissions', label: '权限配置', type: 'link' },
    { name: 'delete', label: '删除', type: 'link' }
  ]

  useEffect(() => {
    loadRoles()
  }, [pagination.current, pagination.pageSize, searchForm])

  useEffect(() => {
    loadPermissionTree()
  }, [])

  const loadRoles = async () => {
    setLoading(true)
    try {
      const res = await fetchRoles({
        page: pagination.current,
        pageSize: pagination.pageSize,
        roleName: searchForm.roleName,
        status: searchForm.status
      })
      const pageData = res.data
      setRoleList(pageData?.list || [])
      setPagination((prev) => ({ ...prev, total: pageData?.total || 0 }))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const loadPermissionTree = async () => {
    setPermissionLoading(true)
    try {
      const res = await fetchPermissionTree()
      const tree = transformPermissionTree(res.data || [])
      setPermissionTree(tree)
    } catch (error) {
      console.error(error)
    } finally {
      setPermissionLoading(false)
    }
  }

  const transformPermissionTree = (nodes: PermissionTreeNode[]): DataNode[] =>
    nodes.map((node) => ({
      key: node.id,
      title: `${node.permissionName} (${node.permissionCode})`,
      children: node.children ? transformPermissionTree(node.children) : undefined
    }))

  const handleSearch = (data: Record<string, any>) => {
    setSearchForm({
      roleName: data.roleName || '',
      status: data.status ?? ''
    })
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleReset = () => {
    setSearchForm({ roleName: '', status: '' })
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const openCreateModal = () => {
    setFormMode('create')
    setCurrentRole(null)
    form.resetFields()
    form.setFieldsValue({ status: 1 })
    setFormVisible(true)
  }

  const openEditModal = async (role: Role) => {
    setFormMode('edit')
    setCurrentRole(role)
    form.resetFields()
    let detail = role
    if (!role.permissionIds) {
      const res = await fetchRoleDetail(role.id)
      detail = res.data
    }
    form.setFieldsValue({
      roleName: detail.roleName,
      roleCode: detail.roleCode,
      description: detail.description,
      status: detail.status
    })
    setFormVisible(true)
  }

  const handleAction = (action: string) => {
    if (action === 'add') {
      openCreateModal()
    }
    if (action === 'refresh') {
      loadRoles()
    }
  }

  const handleTableAction = (action: string, role: Role) => {
    switch (action) {
      case 'edit':
        openEditModal(role)
        break
      case 'permissions':
        openPermissionModal(role)
        break
      case 'delete':
        Modal.confirm({
          title: '确认删除',
          content: `确定删除角色 ${role.roleName} 吗？`,
          onOk: async () => {
            try {
              await deleteRole(role.id)
              message.success('删除成功')
              loadRoles()
            } catch (error) {
              console.error(error)
            }
          }
        })
        break
      default:
        break
    }
  }

  const submitRoleForm = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)
      if (formMode === 'create') {
        await createRole(values as RolePayload)
        message.success('角色创建成功')
      } else if (currentRole) {
        await updateRole(currentRole.id, values as RolePayload)
        message.success('角色更新成功')
      }
      setFormVisible(false)
      loadRoles()
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const openPermissionModal = async (role: Role) => {
    setCurrentRole(role)
    if (!permissionTree.length) {
      await loadPermissionTree()
    }
    let detail = role
    if (!role.permissionIds) {
      const res = await fetchRoleDetail(role.id)
      detail = res.data
    }
    setCheckedPermissions(detail.permissionIds?.map((id) => id) || [])
    setPermissionModalVisible(true)
  }

  const submitPermissions = async () => {
    if (!currentRole) return
    try {
      setPermissionSubmitting(true)
      const ids = checkedPermissions.map((key) => Number(key))
      await assignRolePermissions(currentRole.id, ids)
      message.success('权限更新成功')
      setPermissionModalVisible(false)
      loadRoles()
    } catch (error) {
      console.error(error)
    } finally {
      setPermissionSubmitting(false)
    }
  }

  const handlePagination = (page: number, size: number) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize: size }))
  }

  const renderRoleForm = () => (
    <Form form={form} layout="vertical">
      <Form.Item
        name="roleName"
        label="角色名称"
        rules={[{ required: true, message: '请输入角色名称' }]}
      >
        <Input placeholder="请输入角色名称" />
      </Form.Item>
      <Form.Item
        name="roleCode"
        label="角色编码"
        rules={[{ required: true, message: '请输入角色编码' }]}
      >
        <Input placeholder="请输入角色编码" disabled={formMode === 'edit'} />
      </Form.Item>
      <Form.Item name="description" label="描述">
        <Input.TextArea rows={3} placeholder="请输入角色描述" />
      </Form.Item>
      <Form.Item
        name="status"
        label="状态"
        initialValue={1}
        rules={[{ required: true, message: '请选择状态' }]}
      >
        <Select options={roleStatusOptions} />
      </Form.Item>
    </Form>
  )

  return (
    <>
      <TablePageLayout
        title="角色管理"
        searchItems={searchItems}
        initialFormData={searchForm}
        onSearch={handleSearch}
        onReset={handleReset}
        actionButtons={actionButtons}
        onAction={handleAction}
        tableData={roleList}
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
        title={formMode === 'create' ? '新增角色' : '编辑角色'}
        onCancel={() => setFormVisible(false)}
        onOk={submitRoleForm}
        confirmLoading={submitting}
        destroyOnClose
        width={520}
      >
        {renderRoleForm()}
      </Modal>

      <Modal
        open={permissionModalVisible}
        title={`配置权限 - ${currentRole?.roleName || ''}`}
        onCancel={() => setPermissionModalVisible(false)}
        onOk={submitPermissions}
        confirmLoading={permissionSubmitting}
        destroyOnClose
        width={540}
      >
        <Spin spinning={permissionLoading}>
          <Tree
            checkable
            selectable={false}
            treeData={permissionTree}
            checkedKeys={checkedPermissions}
            onCheck={(keys) => {
              if (Array.isArray(keys)) {
                setCheckedPermissions(keys)
              } else {
                setCheckedPermissions(keys.checked as React.Key[])
              }
            }}
            defaultExpandAll
            style={{ maxHeight: 400, overflow: 'auto' }}
          />
        </Spin>
      </Modal>
    </>
  )
}

export default RoleManagement
