import React, { useEffect, useMemo, useState } from 'react'
import { Form, Input, Modal, Select, message } from 'antd'
import TablePageLayout from '../../components/layouts/TablePageLayout'
import type { User, Role, TableColumn, ActionButton as ActionButtonType, SearchItem } from '../../types'
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  batchDeleteUsers,
  updateUserPassword,
  updateUserStatus,
  type UserCreatePayload,
  type UserFormPayload
} from '../../api/user'
import { fetchAllRoles } from '../../api/role'

const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 }
]

const formStatusOptions = statusOptions.filter((item) => item.value !== '') as Array<{ label: string; value: number }>

const UserManagementUser: React.FC = () => {
  const [searchForm, setSearchForm] = useState<{ username?: string; email?: string; status?: number | '' }>({
    username: '',
    email: '',
    status: ''
  })
  const [userList, setUserList] = useState<User[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [roleOptions, setRoleOptions] = useState<Role[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [loading, setLoading] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [passwordSubmitting, setPasswordSubmitting] = useState(false)

  const searchItems: SearchItem[] = [
    {
      label: '用户名',
      prop: 'username',
      type: 'input',
      placeholder: '请输入用户名'
    },
    {
      label: '邮箱',
      prop: 'email',
      type: 'input',
      placeholder: '请输入邮箱'
    },
    {
      label: '状态',
      prop: 'status',
      type: 'select',
      options: statusOptions
    }
  ]

  const actionButtons: ActionButtonType[] = [
    { name: 'add', label: '新增用户', type: 'primary' },
    { name: 'batchDelete', label: '批量删除', type: 'default' },
    { name: 'refresh', label: '刷新', type: 'default' }
  ]

  const tableColumns: TableColumn[] = useMemo(() => ([
    { prop: 'username', label: '用户名' },
    { prop: 'realName', label: '姓名' },
    { prop: 'email', label: '邮箱' },
    { prop: 'mobile', label: '手机号' },
    { prop: 'department', label: '部门' },
    {
      prop: 'roles',
      label: '角色',
      formatter: (row: User) => row.roles?.map((role) => role.roleName).join('、') || '-'
    },
    {
      prop: 'status',
      label: '状态',
      formatter: (row: User) => (row.status === 1 ? '启用' : '禁用')
    },
    { prop: 'createTime', label: '创建时间' }
  ]), [])

  const tableActions: ActionButtonType[] = [
    { name: 'edit', label: '编辑', type: 'link' },
    { name: 'resetPassword', label: '重置密码', type: 'link' },
    {
      name: 'disable',
      label: '禁用',
      type: 'link',
      disabled: (row: User) => row.status === 0
    },
    {
      name: 'enable',
      label: '启用',
      type: 'link',
      disabled: (row: User) => row.status === 1
    },
    { name: 'delete', label: '删除', type: 'link' }
  ]

  useEffect(() => {
    fetchRoleOptions()
  }, [])

  useEffect(() => {
    loadUsers()
  }, [pagination.current, pagination.pageSize, searchForm])

  const fetchRoleOptions = async () => {
    try {
      const res = await fetchAllRoles()
      setRoleOptions(res.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const loadUsers = async () => {
    setLoading(true)
    try {
      const res = await fetchUsers({
        page: pagination.current,
        pageSize: pagination.pageSize,
        username: searchForm.username,
        email: searchForm.email,
        status: searchForm.status
      })
      const pageData = res.data
      setUserList(pageData?.list || [])
      setPagination((prev) => ({ ...prev, total: pageData?.total || 0 }))
    } catch (error) {
      // 错误已统一处理
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (formData: Record<string, any>) => {
    setSearchForm({
      username: formData.username || '',
      email: formData.email || '',
      status: formData.status ?? ''
    })
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleReset = () => {
    setSearchForm({ username: '', email: '', status: '' })
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const openCreateModal = () => {
    setFormMode('create')
    setCurrentUser(null)
    form.resetFields()
    form.setFieldsValue({ status: 1, roleIds: [] })
    setFormVisible(true)
  }

  const openEditModal = (record: User) => {
    setFormMode('edit')
    setCurrentUser(record)
    form.resetFields()
    form.setFieldsValue({
      username: record.username,
      email: record.email,
      realName: record.realName,
      mobile: record.mobile,
      department: record.department,
      status: record.status,
      roleIds: record.roles?.map((item) => item.roleId) || []
    })
    setFormVisible(true)
  }

  const handleAction = async (action: string) => {
    switch (action) {
      case 'add':
        openCreateModal()
        break
      case 'batchDelete':
        if (selectedRowKeys.length === 0) {
          message.warning('请选择要删除的用户')
          return
        }
        Modal.confirm({
          title: '确认删除',
          content: `确定删除选中的 ${selectedRowKeys.length} 个用户吗？`,
          onOk: async () => {
            try {
              const ids = selectedRowKeys.map((key) => Number(key))
              await batchDeleteUsers(ids)
              message.success('删除成功')
              setSelectedRowKeys([])
              loadUsers()
            } catch (error) {
              console.error(error)
            }
          }
        })
        break
      case 'refresh':
        loadUsers()
        break
      default:
        break
    }
  }

  const changeStatus = async (record: User, status: number) => {
    try {
      await updateUserStatus(record.id, status)
      message.success(status === 1 ? '已启用' : '已禁用')
      loadUsers()
    } catch (error) {
      console.error(error)
    }
  }

  const handleTableAction = (action: string, record: User) => {
    switch (action) {
      case 'edit':
        openEditModal(record)
        break
      case 'resetPassword':
        setCurrentUser(record)
        passwordForm.resetFields()
        setPasswordModalVisible(true)
        break
      case 'delete':
        Modal.confirm({
          title: '确认删除',
          content: `确定删除用户 ${record.username} 吗？`,
          onOk: async () => {
            try {
              await deleteUser(record.id)
              message.success('删除成功')
              loadUsers()
            } catch (error) {
              console.error(error)
            }
          }
        })
        break
      case 'disable':
        changeStatus(record, 0)
        break
      case 'enable':
        changeStatus(record, 1)
        break
      default:
        break
    }
  }

  const submitUserForm = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)
      if (formMode === 'create') {
        const { password, ...rest } = values
        const payload: UserCreatePayload = { ...(rest as UserFormPayload), password }
        await createUser(payload)
        message.success('用户创建成功')
      } else if (currentUser) {
        const { password, ...rest } = values
        await updateUser(currentUser.id, rest as UserFormPayload)
        message.success('用户更新成功')
      }
      setFormVisible(false)
      loadUsers()
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const submitPassword = async () => {
    try {
      const values = await passwordForm.validateFields()
      if (!currentUser) return
      setPasswordSubmitting(true)
      await updateUserPassword(currentUser.id, values.password)
      message.success('密码已更新')
      setPasswordModalVisible(false)
    } catch (error) {
      console.error(error)
    } finally {
      setPasswordSubmitting(false)
    }
  }

  const handleSelectionChange = (keys: React.Key[]) => {
    setSelectedRowKeys(keys)
  }

  const handlePagination = (page: number, size: number) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize: size }))
  }

  const renderUserForm = () => (
    <Form form={form} layout="vertical">
      <Form.Item
        name="username"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="请输入用户名" disabled={formMode === 'edit'} />
      </Form.Item>
      {formMode === 'create' && (
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
      )}
      <Form.Item name="realName" label="姓名">
        <Input placeholder="请输入姓名" />
      </Form.Item>
      <Form.Item name="email" label="邮箱">
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item name="mobile" label="手机号">
        <Input placeholder="请输入手机号" />
      </Form.Item>
      <Form.Item name="department" label="部门">
        <Input placeholder="请输入部门" />
      </Form.Item>
      <Form.Item name="roleIds" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
        <Select
          mode="multiple"
          placeholder="请选择角色"
          options={roleOptions.map((role) => ({ label: role.roleName, value: role.id }))}
        />
      </Form.Item>
      <Form.Item
        name="status"
        label="状态"
        initialValue={1}
        rules={[{ required: true, message: '请选择状态' }]}
      >
        <Select options={formStatusOptions} />
      </Form.Item>
    </Form>
  )

  const renderPasswordForm = () => (
    <Form form={passwordForm} layout="vertical">
      <Form.Item
        name="password"
        label="新密码"
        rules={[{ required: true, message: '请输入新密码' }]}
      >
        <Input.Password placeholder="请输入新密码" />
      </Form.Item>
    </Form>
  )

  return (
    <>
      <TablePageLayout
        title="用户管理"
        searchItems={searchItems}
        initialFormData={searchForm}
        onSearch={handleSearch}
        onReset={handleReset}
        actionButtons={actionButtons}
        onAction={handleAction}
        tableData={userList}
        tableColumns={tableColumns}
        loading={loading}
        showSelection={true}
        showTableAction={true}
        tableActions={tableActions}
        rowKey="id"
        onSelectionChange={handleSelectionChange}
        onTableAction={handleTableAction}
        total={pagination.total}
        current={pagination.current}
        pageSize={pagination.pageSize}
        onPagination={handlePagination}
      />

      <Modal
        open={formVisible}
        title={formMode === 'create' ? '新增用户' : '编辑用户'}
        onCancel={() => setFormVisible(false)}
        onOk={submitUserForm}
        confirmLoading={submitting}
        destroyOnClose
        width={520}
      >
        {renderUserForm()}
      </Modal>

      <Modal
        open={passwordModalVisible}
        title={`重置密码 - ${currentUser?.username || ''}`}
        onCancel={() => setPasswordModalVisible(false)}
        onOk={submitPassword}
        confirmLoading={passwordSubmitting}
        destroyOnClose
      >
        {renderPasswordForm()}
      </Modal>
    </>
  )
}

export default UserManagementUser
