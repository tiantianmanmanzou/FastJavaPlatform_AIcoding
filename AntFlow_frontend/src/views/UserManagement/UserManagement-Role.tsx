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
import type { Role, PermissionTreeNode } from '../../types'
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
import './UserManagementRole.scss'

const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: '1' },
  { label: '禁用', value: '0' }
]

const RoleManagement: React.FC = () => {
  const [filters, setFilters] = useState({ roleName: '', status: '' })
  const [searchInputs, setSearchInputs] = useState(filters)
  const [roleList, setRoleList] = useState<Role[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [loading, setLoading] = useState(false)

  const [formVisible, setFormVisible] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [roleForm, setRoleForm] = useState({
    roleName: '',
    roleCode: '',
    description: '',
    status: '1'
  })
  const [currentRole, setCurrentRole] = useState<Role | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [permissionTree, setPermissionTree] = useState<PermissionTreeNode[]>([])
  const [permissionLoading, setPermissionLoading] = useState(false)
  const [checkedPermissions, setCheckedPermissions] = useState<number[]>([])
  const [permissionSubmitting, setPermissionSubmitting] = useState(false)

  useEffect(() => {
    loadRoles()
  }, [filters, pagination.current, pagination.pageSize])

  useEffect(() => {
    loadPermissionTree()
  }, [])

  const loadRoles = async () => {
    setLoading(true)
    try {
      const res = await fetchRoles({
        page: pagination.current,
        pageSize: pagination.pageSize,
        roleName: filters.roleName,
        status: filters.status === '' ? undefined : Number(filters.status)
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

  const transformPermissionTree = (nodes: PermissionTreeNode[]): PermissionTreeNode[] =>
    nodes.map((node) => ({
      ...node,
      children: node.children ? transformPermissionTree(node.children) : undefined
    }))

  const loadPermissionTree = async () => {
    setPermissionLoading(true)
    try {
      const res = await fetchPermissionTree()
      setPermissionTree(transformPermissionTree(res.data || []))
    } catch (error) {
      console.error(error)
    } finally {
      setPermissionLoading(false)
    }
  }

  const tableRows = useMemo(() => roleList, [roleList])

  const searchFields: SearchField[] = [
    { key: 'roleName', type: 'input', placeholder: '请输入角色名' },
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
    const reset = { roleName: '', status: '' }
    setSearchInputs(reset)
    setFilters(reset)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const openCreateModal = () => {
    setFormMode('create')
    setCurrentRole(null)
    setRoleForm({
      roleName: '',
      roleCode: '',
      description: '',
      status: '1'
    })
    setFormVisible(true)
  }

  const openEditModal = async (role: Role) => {
    setFormMode('edit')
    setCurrentRole(role)
    let detail = role
    if (!role.permissionIds) {
      const res = await fetchRoleDetail(role.id)
      detail = res.data
    }
    setRoleForm({
      roleName: detail.roleName,
      roleCode: detail.roleCode,
      description: detail.description || '',
      status: detail.status?.toString() ?? '1'
    })
    setFormVisible(true)
  }

  const handleAction = (action: string) => {
    if (action === 'add') openCreateModal()
    if (action === 'refresh') loadRoles()
  }

  const handleTableAction = (action: string, role: Role) => {
    switch (action) {
      case 'edit':
        openEditModal(role)
        break
      case 'permissions':
        openPermissionModal(role)
        break
      default:
        break
    }
  }

  const handleDeleteRole = async (role: Role) => {
    try {
      await deleteRole(role.id)
      message.success('删除成功')
      loadRoles()
    } catch (error) {
      console.error(error)
    }
  }

  const validateRoleForm = () => {
    if (!roleForm.roleName.trim()) {
      message.error('请输入角色名称')
      return false
    }
    if (!roleForm.roleCode.trim()) {
      message.error('请输入角色编码')
      return false
    }
    return true
  }

  const submitRoleForm = async () => {
    if (!validateRoleForm()) return
    try {
      setSubmitting(true)
      const payload: RolePayload = {
        roleName: roleForm.roleName,
        roleCode: roleForm.roleCode,
        description: roleForm.description,
        status: Number(roleForm.status)
      }
      if (formMode === 'create') {
        await createRole(payload)
        message.success('角色创建成功')
      } else if (currentRole) {
        await updateRole(currentRole.id, payload)
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

  const handleTogglePermission = (id: number, checked: boolean) => {
    setCheckedPermissions((prev) => {
      if (checked) {
        return prev.includes(id) ? prev : [...prev, id]
      }
      return prev.filter((item) => item !== id)
    })
  }

  const renderPermissionNodes = (nodes: PermissionTreeNode[]) => (
    <ul>
      {nodes.map((node) => (
        <li key={node.id}>
          <label className="flex items-center gap-2 py-1 text-sm text-slate-700">
            <Checkbox
              checked={checkedPermissions.includes(node.id)}
              onCheckedChange={(checked) => handleTogglePermission(node.id, Boolean(checked))}
            />
            <span>{node.permissionName}</span>
            <Badge variant="secondary" className="bg-slate-100 text-xs text-slate-600">
              {node.permissionCode}
            </Badge>
          </label>
          {node.children && node.children.length > 0 && (
            <div className="pl-5">{renderPermissionNodes(node.children)}</div>
          )}
        </li>
      ))}
    </ul>
  )

  const submitPermissions = async () => {
    if (!currentRole) return
    try {
      setPermissionSubmitting(true)
      await assignRolePermissions(currentRole.id, checkedPermissions)
      message.success('权限更新成功')
      setPermissionModalVisible(false)
      loadRoles()
    } catch (error) {
      console.error(error)
    } finally {
      setPermissionSubmitting(false)
    }
  }

  const handlePagination = (page: number) => {
    setPagination((prev) => ({ ...prev, current: page }))
  }

  return (
    <div className="role-management-page space-y-6">
      <PageHeader title="角色管理" />

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
                <Button onClick={() => handleAction('add')}>新增角色</Button>
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
                <TableHead>角色名</TableHead>
                <TableHead>角色编码</TableHead>
                <TableHead>描述</TableHead>
                <TableHead className="w-20 text-center">状态</TableHead>
                <TableHead className="w-40 text-center">创建时间</TableHead>
                <TableHead className="w-48 text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-slate-500">
                    数据加载中...
                  </TableCell>
                </TableRow>
              )}
              {!loading && tableRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-slate-500">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                tableRows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-slate-900">{item.roleName}</TableCell>
                    <TableCell>{item.roleCode}</TableCell>
                    <TableCell>{item.description || '-'}</TableCell>
                    <TableCell className="text-center">
                      <span className={item.status === 1 ? 'text-emerald-600' : 'text-rose-500'}>
                        {item.status === 1 ? '启用' : '禁用'}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-sm text-slate-500">{item.createTime || '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap justify-center gap-2 text-sm">
                        <Button variant="link" size="sm" className="px-0" onClick={() => handleTableAction('edit', item)}>
                          编辑
                        </Button>
                        <Button variant="link" size="sm" className="px-0" onClick={() => handleTableAction('permissions', item)}>
                          权限配置
                        </Button>
                        <ConfirmPopover
                          title="删除角色"
                          description={`确定删除角色 ${item.roleName} 吗？`}
                          onConfirm={() => handleDeleteRole(item)}
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
            <span>第 {pagination.current} / {Math.max(1, Math.ceil(pagination.total / pagination.pageSize))} 页</span>
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
                onClick={() => handlePagination(Math.min(Math.max(1, Math.ceil(pagination.total / pagination.pageSize)), pagination.current + 1))}
                disabled={pagination.current >= Math.max(1, Math.ceil(pagination.total / pagination.pageSize))}
              >
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={formVisible} onOpenChange={(open) => setFormVisible(open)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{formMode === 'create' ? '新增角色' : '编辑角色'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>角色名称</Label>
              <Input
                placeholder="请输入角色名称"
                value={roleForm.roleName}
                onChange={(e) => setRoleForm((prev) => ({ ...prev, roleName: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>角色编码</Label>
              <Input
                placeholder="请输入角色编码"
                value={roleForm.roleCode}
                disabled={formMode === 'edit'}
                onChange={(e) => setRoleForm((prev) => ({ ...prev, roleCode: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label>描述</Label>
              <textarea
                className="min-h-[80px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="请输入角色描述"
                value={roleForm.description}
                onChange={(e) => setRoleForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>状态</Label>
              <Select value={roleForm.status} onValueChange={(value) => setRoleForm((prev) => ({ ...prev, status: value }))}>
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
            <Button onClick={submitRoleForm} disabled={submitting}>
              {submitting ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={permissionModalVisible} onOpenChange={(open) => setPermissionModalVisible(open)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>权限配置 - {currentRole?.roleName || ''}</DialogTitle>
          </DialogHeader>
          <div className="h-[420px] overflow-auto rounded-lg border border-slate-200 p-4">
            {permissionLoading ? (
              <div className="flex h-full items-center justify-center text-slate-500">权限树加载中...</div>
            ) : permissionTree.length === 0 ? (
              <div className="text-sm text-slate-500">暂无权限数据</div>
            ) : (
              renderPermissionNodes(permissionTree)
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPermissionModalVisible(false)} disabled={permissionSubmitting}>
              取消
            </Button>
            <Button onClick={submitPermissions} disabled={permissionSubmitting}>
              {permissionSubmitting ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RoleManagement
