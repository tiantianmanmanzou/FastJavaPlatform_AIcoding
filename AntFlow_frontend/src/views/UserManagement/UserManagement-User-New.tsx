import React, { useEffect, useMemo, useState } from 'react'
import PageHeader from '@/components/ui/page-header'
import { message } from '@/lib/message'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ConfirmPopover from '@/components/ui/confirm-popover'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
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
import './UserManagementUserNew.scss'

interface DemoUser {
  id: number
  username: string
  realName?: string
  email?: string
  mobile?: string
  department?: string
  role?: string
  status: 'active' | 'inactive'
  createTime: string
}

const departmentOptions = [
  { label: '研发部', value: 'dev' },
  { label: '产品部', value: 'product' },
  { label: '市场部', value: 'market' }
]

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '普通用户', value: 'user' },
  { label: '部门经理', value: 'manager' }
]

const statusOptions = [
  { label: '在职', value: 'active' },
  { label: '离职', value: 'inactive' }
]

const UserManagementUserNew: React.FC = () => {
  const [filters, setFilters] = useState({ username: '', department: '', status: '' })
  const [searchInputs, setSearchInputs] = useState(filters)
  const [userList, setUserList] = useState<DemoUser[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    username: '',
    realName: '',
    email: '',
    mobile: '',
    department: '',
    role: '',
    password: ''
  })
  const [addSubmitting, setAddSubmitting] = useState(false)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    username: '',
    realName: '',
    email: '',
    mobile: '',
    department: '',
    role: ''
  })
  const [currentEditUser, setCurrentEditUser] = useState<DemoUser | null>(null)
  const [editSubmitting, setEditSubmitting] = useState(false)

  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [currentViewUser, setCurrentViewUser] = useState<DemoUser | null>(null)

  useEffect(() => {
    fetchUserList()
  }, [filters, pagination.current, pagination.pageSize])

  const fetchUserList = () => {
    setLoading(true)
    setTimeout(() => {
      const mockData: DemoUser[] = []
      for (let i = 1; i <= 35; i++) {
        const item: DemoUser = {
          id: i,
          username: `user${i}`,
          email: `user${i}@example.com`,
          role: roleOptions[i % roleOptions.length].value,
          status: i % 5 === 0 ? 'inactive' : 'active',
          createTime: new Date(Date.now() - i * 3600 * 1000).toISOString(),
          realName: `用户${i}`,
          department: departmentOptions[i % departmentOptions.length].label,
          mobile: `1381234${i.toString().padStart(4, '0')}`
        }
        mockData.push(item)
      }

      let filtered = [...mockData]
      if (filters.username) {
        filtered = filtered.filter((item) => item.username.includes(filters.username))
      }
      if (filters.department) {
        const map: Record<string, string> = {
          dev: '研发部',
          product: '产品部',
          market: '市场部'
        }
        filtered = filtered.filter((item) => item.department === map[filters.department])
      }
      if (filters.status) {
        filtered = filtered.filter((item) => item.status === filters.status)
      }

      const start = (pagination.current - 1) * pagination.pageSize
      const end = start + pagination.pageSize
      const paginated = filtered.slice(start, end)

      setUserList(paginated)
      setPagination((prev) => ({ ...prev, total: filtered.length }))
      setLoading(false)
    }, 400)
  }

  const tableRows = useMemo(() => userList, [userList])

  const handleSearch = () => {
    setFilters(searchInputs)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleReset = () => {
    const reset = { username: '', department: '', status: '' }
    setSearchInputs(reset)
    setFilters(reset)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleAction = (action: string) => {
    switch (action) {
      case 'add':
        setAddForm({
          username: '',
          realName: '',
          email: '',
          mobile: '',
          department: '',
          role: '',
          password: ''
        })
        setAddDialogOpen(true)
        break
      case 'batchDelete':
        handleBatchDelete()
        break
      case 'export':
        message.info('导出功能开发中')
        break
    }
  }

  const handleBatchDelete = () => {
    if (!selectedRowKeys.length) {
      message.warning('请选择要删除的用户')
      return
    }
    message.success('删除成功')
    setSelectedRowKeys([])
    fetchUserList()
  }

  const handleTableAction = (action: string, row: DemoUser) => {
    switch (action) {
      case 'edit':
        setCurrentEditUser(row)
        setEditForm({
          username: row.username,
          realName: row.realName || '',
          email: row.email || '',
          mobile: row.mobile || '',
          department: departmentOptions.find((opt) => opt.label === row.department)?.value || '',
          role: row.role || ''
        })
        setEditDialogOpen(true)
        break
      case 'view':
        setCurrentViewUser(row)
        setViewDialogOpen(true)
        break
      default:
        break
    }
  }

  const handleResetPassword = (row: DemoUser) => {
    message.success(`已重置 ${row.username} 的密码`)
  }

  const handleDeleteDemoUser = (row: DemoUser) => {
    message.success('删除成功')
    fetchUserList()
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
      setSelectedRowKeys(tableRows.map((row) => Number(row.id)))
    } else {
      setSelectedRowKeys([])
    }
  }

  const validateAddForm = () => {
    if (!addForm.username.trim()) {
      message.error('请输入用户名')
      return false
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(addForm.username)) {
      message.error('用户名长度为3-20个字符，仅限字母、数字、下划线')
      return false
    }
    if (!addForm.realName.trim()) {
      message.error('请输入真实姓名')
      return false
    }
    if (!addForm.email.trim()) {
      message.error('请输入邮箱地址')
      return false
    }
    if (!addForm.mobile.trim()) {
      message.error('请输入手机号')
      return false
    }
    if (!addForm.department) {
      message.error('请选择部门')
      return false
    }
    if (!addForm.role) {
      message.error('请选择角色')
      return false
    }
    if (!addForm.password || addForm.password.length < 6) {
      message.error('请输入至少6位的初始密码')
      return false
    }
    return true
  }

  const submitAddForm = async () => {
    if (!validateAddForm()) return
    setAddSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      message.success('用户添加成功')
      setAddDialogOpen(false)
      fetchUserList()
    } finally {
      setAddSubmitting(false)
    }
  }

  const submitEditForm = async () => {
    if (!currentEditUser) return
    if (!editForm.realName.trim() || !editForm.email.trim() || !editForm.mobile.trim()) {
      message.error('请填写完整用户信息')
      return
    }
    setEditSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      message.success('用户信息更新成功')
      setEditDialogOpen(false)
      setCurrentEditUser(null)
      fetchUserList()
    } finally {
      setEditSubmitting(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize))

  const roleLabel = (value: string) => roleOptions.find((item) => item.value === value)?.label || value

  const renderViewContent = () => {
    if (!currentViewUser) return null
    return (
      <div className="space-y-4 text-sm text-slate-600">
        <div className="flex gap-2">
          <span className="w-20 font-medium text-slate-500">用户名：</span>
          <span>{currentViewUser.username}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-20 font-medium text-slate-500">真实姓名：</span>
          <span>{currentViewUser.realName}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-20 font-medium text-slate-500">邮箱：</span>
          <span>{currentViewUser.email}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-20 font-medium text-slate-500">手机号：</span>
          <span>{currentViewUser.mobile}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-20 font-medium text-slate-500">部门：</span>
          <span>{currentViewUser.department}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-20 font-medium text-slate-500">角色：</span>
          <span>{roleLabel(currentViewUser.role || '')}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-20 font-medium text-slate-500">状态：</span>
          <span className={currentViewUser.status === 'active' ? 'text-emerald-600' : 'text-rose-500'}>
            {currentViewUser.status === 'active' ? '在职' : '离职'}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="w-20 font-medium text-slate-500">创建时间：</span>
          <span>{new Date(currentViewUser.createTime).toLocaleString('zh-CN')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="user-management-new-page space-y-6">
      <PageHeader title="用户管理" />

      <Card>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">用户名</label>
              <Input
                placeholder="请输入用户名"
                value={searchInputs.username}
                onChange={(e) => setSearchInputs((prev) => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">部门</label>
              <Select
                value={searchInputs.department === '' ? 'all' : searchInputs.department}
                onValueChange={(value) => setSearchInputs((prev) => ({ ...prev, department: value === 'all' ? '' : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="全部部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {departmentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">状态</label>
              <Select
                value={searchInputs.status === '' ? 'all' : searchInputs.status}
                onValueChange={(value) => setSearchInputs((prev) => ({ ...prev, status: value === 'all' ? '' : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="全部状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2">
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? '查询中...' : '搜索'}
              </Button>
              <Button variant="outline" onClick={handleReset} disabled={loading}>
                重置
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 md:ml-auto">
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
              <Button variant="ghost" onClick={() => handleAction('export')} disabled={loading}>
                导出
              </Button>
            </div>
          </div>
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
                <TableHead>部门</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead>手机号</TableHead>
                <TableHead className="w-24 text-center">状态</TableHead>
                <TableHead className="w-40 text-center">创建时间</TableHead>
                <TableHead className="w-56 text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-sm text-slate-500">
                    数据加载中...
                  </TableCell>
                </TableRow>
              )}
              {!loading && tableRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-sm text-slate-500">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                tableRows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedRowKeys.includes(Number(item.id))}
                        onCheckedChange={(checked) => toggleRowSelection(Number(item.id), Boolean(checked))}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">{item.username}</TableCell>
                    <TableCell>{item.realName || '-'}</TableCell>
                    <TableCell>{item.department || '-'}</TableCell>
                    <TableCell>{item.email || '-'}</TableCell>
                    <TableCell>{item.mobile || '-'}</TableCell>
                    <TableCell className="text-center">
                      <span className={item.status === 'active' ? 'text-emerald-600' : 'text-rose-500'}>
                        {item.status === 'active' ? '在职' : '离职'}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-sm text-slate-500">{item.createTime}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap justify-center gap-2 text-sm">
                        <Button variant="link" size="sm" className="px-0" onClick={() => handleTableAction('edit', item)}>
                          编辑
                        </Button>
                        <Button variant="link" size="sm" className="px-0" onClick={() => handleTableAction('view', item)}>
                          查看
                        </Button>
                        <ConfirmPopover
                          title="重置密码"
                          description={`确定重置 ${item.username} 的密码吗？`}
                          onConfirm={() => handleResetPassword(item)}
                          tone="default"
                        >
                          <Button variant="link" size="sm" className="px-0">
                            重置密码
                          </Button>
                        </ConfirmPopover>
                        <ConfirmPopover
                          title="删除用户"
                          description={`确定删除用户 ${item.username} 吗？`}
                          onConfirm={() => handleDeleteDemoUser(item)}
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
                onClick={() => setPagination((prev) => ({ ...prev, current: Math.max(1, prev.current - 1) }))}
                disabled={pagination.current === 1}
              >
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({ ...prev, current: Math.min(totalPages, prev.current + 1) }))
                }
                disabled={pagination.current === totalPages}
              >
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={addDialogOpen} onOpenChange={(open) => setAddDialogOpen(open)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新增用户</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>用户名</Label>
              <Input
                placeholder="用户名"
                value={addForm.username}
                onChange={(e) => setAddForm((prev) => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>真实姓名</Label>
              <Input
                placeholder="真实姓名"
                value={addForm.realName}
                onChange={(e) => setAddForm((prev) => ({ ...prev, realName: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>邮箱</Label>
              <Input
                placeholder="邮箱"
                value={addForm.email}
                onChange={(e) => setAddForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>手机号</Label>
              <Input
                placeholder="手机号"
                value={addForm.mobile}
                onChange={(e) => setAddForm((prev) => ({ ...prev, mobile: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>部门</Label>
              <Select
                value={addForm.department || 'none'}
                onValueChange={(value) => setAddForm((prev) => ({ ...prev, department: value === 'none' ? '' : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">请选择</SelectItem>
                  {departmentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>角色</Label>
              <Select
                value={addForm.role || 'none'}
                onValueChange={(value) => setAddForm((prev) => ({ ...prev, role: value === 'none' ? '' : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">请选择</SelectItem>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label>初始密码</Label>
              <Input
                type="password"
                placeholder="请输入初始密码"
                value={addForm.password}
                onChange={(e) => setAddForm((prev) => ({ ...prev, password: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)} disabled={addSubmitting}>
              取消
            </Button>
            <Button onClick={submitAddForm} disabled={addSubmitting}>
              {addSubmitting ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={(open) => setEditDialogOpen(open)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑用户</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>用户名</Label>
              <Input value={editForm.username} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label>真实姓名</Label>
              <Input
                placeholder="真实姓名"
                value={editForm.realName}
                onChange={(e) => setEditForm((prev) => ({ ...prev, realName: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>邮箱</Label>
              <Input
                placeholder="邮箱"
                value={editForm.email}
                onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>手机号</Label>
              <Input
                placeholder="手机号"
                value={editForm.mobile}
                onChange={(e) => setEditForm((prev) => ({ ...prev, mobile: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>部门</Label>
              <Select
                value={editForm.department || 'none'}
                onValueChange={(value) => setEditForm((prev) => ({ ...prev, department: value === 'none' ? '' : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">请选择</SelectItem>
                  {departmentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>角色</Label>
              <Select
                value={editForm.role || 'none'}
                onValueChange={(value) => setEditForm((prev) => ({ ...prev, role: value === 'none' ? '' : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">请选择</SelectItem>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} disabled={editSubmitting}>
              取消
            </Button>
            <Button onClick={submitEditForm} disabled={editSubmitting}>
              {editSubmitting ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={(open) => setViewDialogOpen(open)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>查看用户信息</DialogTitle>
          </DialogHeader>
          {renderViewContent()}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserManagementUserNew
