import React, { useEffect, useMemo, useState } from 'react'
import PageHeader from '@/components/ui/page-header'
import { message } from '@/lib/message'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SearchBar, { type SearchField } from '@/components/ui/search-bar'
import ConfirmPopover from '@/components/ui/confirm-popover'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { User, Role } from '../../types'
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
import './UserManagementUser.scss'

const statusFilterOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: '1' },
  { label: '禁用', value: '0' }
]

interface UserFormState {
  username: string
  password: string
  realName: string
  email: string
  mobile: string
  department: string
  roleIds: number[]
  status: string
}

const UserManagementUser: React.FC = () => {
  const [filters, setFilters] = useState({ username: '', email: '', status: '' })
  const [searchInputs, setSearchInputs] = useState(filters)

  const [userList, setUserList] = useState<User[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [roleOptions, setRoleOptions] = useState<Role[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [loading, setLoading] = useState(false)

  const [formVisible, setFormVisible] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [userForm, setUserForm] = useState<UserFormState>({
    username: '',
    password: '',
    realName: '',
    email: '',
    mobile: '',
    department: '',
    roleIds: [] as number[],
    status: '1'
  })
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [passwordSubmitting, setPasswordSubmitting] = useState(false)

  useEffect(() => {
    fetchRoleOptions()
  }, [])

  useEffect(() => {
    loadUsers()
  }, [filters, pagination.current, pagination.pageSize])

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
        username: filters.username,
        email: filters.email,
        status: filters.status === '' ? undefined : Number(filters.status)
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

  const tableRows = useMemo(() => userList, [userList])

  const searchFields: SearchField[] = [
    { key: 'username', type: 'input', placeholder: '请输入用户名' },
    { key: 'email', type: 'input', placeholder: '请输入邮箱' },
    {
      key: 'status',
      type: 'select',
      placeholder: '全部状态',
      options: [
        { label: '启用', value: '1' },
        { label: '禁用', value: '0' }
      ]
    }
  ]

  const handleSearch = () => {
    setFilters(searchInputs)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleReset = () => {
    const reset = { username: '', email: '', status: '' }
    setSearchInputs(reset)
    setFilters(reset)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const openCreateModal = () => {
    setFormMode('create')
    setCurrentUser(null)
    setUserForm({
      username: '',
      password: '',
      realName: '',
      email: '',
      mobile: '',
      department: '',
      roleIds: [],
      status: '1'
    })
    setFormVisible(true)
  }

  const openEditModal = (record: User) => {
    setFormMode('edit')
    setCurrentUser(record)
    setUserForm({
      username: record.username,
      password: '',
      realName: record.realName || '',
      email: record.email || '',
      mobile: record.mobile || '',
      department: record.department || '',
      roleIds: record.roles?.map((item) => item.roleId) || [],
      status: record.status?.toString() ?? '1'
    })
    setFormVisible(true)
  }

  const handleAction = async (action: string) => {
    switch (action) {
      case 'add':
        openCreateModal()
        break
      case 'refresh':
        loadUsers()
        break
      default:
        break
    }
  }

  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的用户')
      return
    }
    try {
      await batchDeleteUsers(selectedRowKeys)
      message.success('删除成功')
      setSelectedRowKeys([])
      loadUsers()
    } catch (error) {
      console.error(error)
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
        setPasswordValue('')
        setPasswordModalVisible(true)
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

  const handleDeleteUser = async (record: User) => {
    try {
      await deleteUser(record.id)
      message.success('删除成功')
      loadUsers()
    } catch (error) {
      console.error(error)
    }
  }

  const validateUserForm = () => {
    if (!userForm.username.trim()) {
      message.error('请输入用户名')
      return false
    }
    if (formMode === 'create' && !userForm.password.trim()) {
      message.error('请输入密码')
      return false
    }
    if (!userForm.roleIds.length) {
      message.error('请选择角色')
      return false
    }
    return true
  }

  const buildFormPayload = (formState: Omit<UserFormState, 'password'>): UserFormPayload => ({
    username: formState.username.trim(),
    email: formState.email || undefined,
    realName: formState.realName || undefined,
    mobile: formState.mobile || undefined,
    department: formState.department || undefined,
    status: Number(formState.status),
    roleIds: formState.roleIds
  })

  const submitUserForm = async () => {
    if (!validateUserForm()) return
    try {
      setSubmitting(true)
      if (formMode === 'create') {
        const { password, ...rest } = userForm
        const basePayload = buildFormPayload(rest)
        const payload: UserCreatePayload = {
          ...basePayload,
          password
        }
        await createUser(payload)
        message.success('用户创建成功')
      } else if (currentUser) {
        const { password, ...rest } = userForm
        const payload: UserFormPayload = buildFormPayload(rest)
        await updateUser(currentUser.id, payload)
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
    if (!passwordValue.trim()) {
      message.error('请输入新密码')
      return
    }
    if (!currentUser) return
    setPasswordSubmitting(true)
    try {
      await updateUserPassword(currentUser.id, passwordValue)
      message.success('密码已更新')
      setPasswordModalVisible(false)
    } catch (error) {
      console.error(error)
    } finally {
      setPasswordSubmitting(false)
    }
  }

  const toggleRowSelection = (id: number, checked: boolean) => {
    setSelectedRowKeys((prev) => {
      if (checked) {
        return prev.includes(id) ? prev : [...prev, id]
      }
      return prev.filter((key) => key !== id)
    })
  }

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(tableRows.map((item) => item.id))
    } else {
      setSelectedRowKeys([])
    }
  }

  const handlePagination = (page: number) => {
    setPagination((prev) => ({ ...prev, current: page }))
  }

  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize))

  return (
    <div className="user-management-page space-y-6">
      <PageHeader title="用户管理" />

      <Card>
        <CardContent className="space-y-6">
          <SearchBar
            fields={searchFields}
            values={searchInputs}
            onValuesChange={setSearchInputs}
            onSearch={handleSearch}
            onReset={handleReset}
            loading={loading}
            actions={
              <>
                <Button onClick={() => handleAction('add')}>新增用户</Button>
                <ConfirmPopover
                  title="批量删除用户"
                  description={`确定删除选中的 ${selectedRowKeys.length} 个用户吗？`}
                  onConfirm={handleBatchDelete}
                  disabled={selectedRowKeys.length === 0}
                >
                  <Button variant="outline" disabled={selectedRowKeys.length === 0}>
                    批量删除
                  </Button>
                </ConfirmPopover>
                <Button variant="ghost" onClick={() => handleAction('refresh')} disabled={loading}>
                  刷新
                </Button>
              </>
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">
                  <Checkbox
                    checked={selectedRowKeys.length > 0 && selectedRowKeys.length === tableRows.length}
                    onCheckedChange={(checked) => toggleSelectAll(Boolean(checked))}
                  />
                </TableHead>
                <TableHead>用户名</TableHead>
                <TableHead>姓名</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead>手机号</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>角色</TableHead>
                <TableHead className="w-20 text-center">状态</TableHead>
                <TableHead className="w-40 text-center">创建时间</TableHead>
                <TableHead className="w-48 text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-sm text-slate-500">
                    数据加载中...
                  </TableCell>
                </TableRow>
              )}
              {!loading && tableRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-sm text-slate-500">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                tableRows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedRowKeys.includes(item.id)}
                        onCheckedChange={(checked) => toggleRowSelection(item.id, Boolean(checked))}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-900">{item.username}</div>
                    </TableCell>
                    <TableCell>{item.realName || '-'}</TableCell>
                    <TableCell>{item.email || '-'}</TableCell>
                    <TableCell>{item.mobile || '-'}</TableCell>
                    <TableCell>{item.department || '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.roles?.length
                          ? item.roles.map((role) => (
                              <Badge key={role.roleId} variant="secondary" className="bg-slate-100 text-slate-600">
                                {role.roleName}
                              </Badge>
                            ))
                          : '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={item.status === 1 ? 'text-emerald-600' : 'text-rose-500'}>
                        {item.status === 1 ? '启用' : '禁用'}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-sm text-slate-500">
                      {item.createTime || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap justify-center gap-2 text-sm">
                        <Button variant="link" size="sm" className="px-0" onClick={() => handleTableAction('edit', item)}>
                          编辑
                        </Button>
                        <Button variant="link" size="sm" className="px-0" onClick={() => handleTableAction('resetPassword', item)}>
                          重置密码
                        </Button>
                        {item.status === 1 ? (
                          <Button variant="link" size="sm" className="px-0 text-rose-500" onClick={() => handleTableAction('disable', item)}>
                            禁用
                          </Button>
                        ) : (
                          <Button variant="link" size="sm" className="px-0 text-emerald-600" onClick={() => handleTableAction('enable', item)}>
                            启用
                          </Button>
                        )}
                        <ConfirmPopover
                          title="删除用户"
                          description={`确定删除用户 ${item.username} 吗？`}
                          onConfirm={() => handleDeleteUser(item)}
                        >
                          <Button variant="link" size="sm" className="px-0 text-rose-500">
                            删除
                          </Button>
                        </ConfirmPopover>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
            <span>第 {pagination.current} / {totalPages} 页</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePagination(Math.max(1, pagination.current - 1))}
                disabled={pagination.current === 1}
              >
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePagination(Math.min(totalPages, pagination.current + 1))}
                disabled={pagination.current === totalPages}
              >
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={formVisible} onOpenChange={(open) => setFormVisible(open)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{formMode === 'create' ? '新增用户' : '编辑用户'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>用户名</Label>
              <Input
                placeholder="请输入用户名"
                value={userForm.username}
                disabled={formMode === 'edit'}
                onChange={(e) => setUserForm((prev) => ({ ...prev, username: e.target.value }))}
              />
            </div>
            {formMode === 'create' && (
              <div className="flex flex-col gap-2">
                <Label>密码</Label>
                <Input
                  type="password"
                  placeholder="请输入密码"
                  value={userForm.password}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))}
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label>姓名</Label>
              <Input
                placeholder="请输入姓名"
                value={userForm.realName}
                onChange={(e) => setUserForm((prev) => ({ ...prev, realName: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>邮箱</Label>
              <Input
                placeholder="请输入邮箱"
                value={userForm.email}
                onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>手机号</Label>
              <Input
                placeholder="请输入手机号"
                value={userForm.mobile}
                onChange={(e) => setUserForm((prev) => ({ ...prev, mobile: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>部门</Label>
              <Input
                placeholder="请输入部门"
                value={userForm.department}
                onChange={(e) => setUserForm((prev) => ({ ...prev, department: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label>
                角色 <span className="text-rose-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-2 rounded-md border border-slate-200 p-3">
                {roleOptions.map((role) => (
                  <label key={role.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <Checkbox
                      checked={userForm.roleIds.includes(role.id)}
                      onCheckedChange={() =>
                        setUserForm((prev) => ({
                          ...prev,
                          roleIds: prev.roleIds.includes(role.id)
                            ? prev.roleIds.filter((id) => id !== role.id)
                            : [...prev.roleIds, role.id]
                        }))
                      }
                    />
                    {role.roleName}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>状态</Label>
              <Select
                value={userForm.status}
                onValueChange={(value) => setUserForm((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">启用</SelectItem>
                  <SelectItem value="0">禁用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormVisible(false)} disabled={submitting}>
              取消
            </Button>
            <Button onClick={submitUserForm} disabled={submitting}>
              {submitting ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={passwordModalVisible} onOpenChange={(open) => setPasswordModalVisible(open)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>重置密码 - {currentUser?.username || ''}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>新密码</Label>
            <Input
              type="password"
              placeholder="请输入新密码"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordModalVisible(false)} disabled={passwordSubmitting}>
              取消
            </Button>
            <Button onClick={submitPassword} disabled={passwordSubmitting}>
              {passwordSubmitting ? '提交中...' : '保存'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserManagementUser
