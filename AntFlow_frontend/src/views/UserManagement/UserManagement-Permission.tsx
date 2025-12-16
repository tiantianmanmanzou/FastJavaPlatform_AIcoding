import React, { useEffect, useMemo, useState } from 'react'
import PageHeader from '@/components/ui/page-header'
import { message } from '@/lib/message'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import ConfirmPopover from '@/components/ui/confirm-popover'
import { Input } from '@/components/ui/input'
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
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import type { Permission, PermissionTreeNode } from '../../types'
import {
  fetchPermissions,
  fetchPermissionTree,
  createPermission,
  updatePermission,
  deletePermission,
  type PermissionPayload
} from '../../api/permission'
import './UserManagementPermission.scss'

const typeOptions = [
  { label: '菜单', value: 'menu' },
  { label: '按钮', value: 'button' },
  { label: '接口', value: 'api' }
]

interface TreeNode extends PermissionTreeNode {
  expanded?: boolean
}

const PermissionManagement: React.FC = () => {
  const [filters, setFilters] = useState({ permissionName: '', permissionCode: '', type: '' })
  const [searchInputs, setSearchInputs] = useState(filters)
  const [permissionList, setPermissionList] = useState<Permission[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [loading, setLoading] = useState(false)

  const [formVisible, setFormVisible] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [permissionForm, setPermissionForm] = useState({
    permissionName: '',
    permissionCode: '',
    type: 'menu',
    parentId: undefined as number | undefined,
    path: '',
    method: '',
    sort: '0'
  })
  const [currentPermission, setCurrentPermission] = useState<Permission | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])
  const [treeLoading, setTreeLoading] = useState(false)

  useEffect(() => {
    loadPermissions()
  }, [filters, pagination.current, pagination.pageSize])

  useEffect(() => {
    loadPermissionTree()
  }, [])

  const loadPermissions = async () => {
    setLoading(true)
    try {
      const res = await fetchPermissions({
        page: pagination.current,
        pageSize: pagination.pageSize,
        permissionName: filters.permissionName,
        permissionCode: filters.permissionCode,
        type: filters.type
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
    setTreeLoading(true)
    try {
      const res = await fetchPermissionTree()
      setTreeNodes(transformPermissionTree(res.data || []))
    } catch (error) {
      console.error(error)
    } finally {
      setTreeLoading(false)
    }
  }

  const transformPermissionTree = (nodes: PermissionTreeNode[]): TreeNode[] =>
    nodes.map((node) => ({
      ...node,
      expanded: true,
      children: node.children ? transformPermissionTree(node.children) : undefined
    }))

  const tableRows = useMemo(() => permissionList, [permissionList])

  const handleSearch = () => {
    setFilters(searchInputs)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleReset = () => {
    const reset = { permissionName: '', permissionCode: '', type: '' }
    setSearchInputs(reset)
    setFilters(reset)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const openCreateModal = () => {
    setFormMode('create')
    setCurrentPermission(null)
    setPermissionForm({
      permissionName: '',
      permissionCode: '',
      type: 'menu',
      parentId: undefined,
      path: '',
      method: '',
      sort: '0'
    })
    setFormVisible(true)
  }

  const openEditModal = (record: Permission) => {
    setFormMode('edit')
    setCurrentPermission(record)
    setPermissionForm({
      permissionName: record.permissionName,
      permissionCode: record.permissionCode,
      type: record.type || 'menu',
      parentId: record.parentId,
      path: record.path || '',
      method: record.method || '',
      sort: record.sort?.toString() || '0'
    })
    setFormVisible(true)
  }

  const handleAction = (action: string) => {
    if (action === 'add') openCreateModal()
    if (action === 'refresh') {
      loadPermissions()
      loadPermissionTree()
    }
  }

  const handleTableAction = (action: string, record: Permission) => {
    if (action === 'edit') {
      openEditModal(record)
    }
  }

  const handleDeletePermission = async (record: Permission) => {
    try {
      await deletePermission(record.id)
      message.success('删除成功')
      loadPermissions()
      loadPermissionTree()
    } catch (error) {
      console.error(error)
    }
  }

  const validatePermissionForm = () => {
    if (!permissionForm.permissionName.trim()) {
      message.error('请输入权限名称')
      return false
    }
    if (!permissionForm.permissionCode.trim()) {
      message.error('请输入权限编码')
      return false
    }
    if (!permissionForm.type) {
      message.error('请选择权限类型')
      return false
    }
    return true
  }

  const submitForm = async () => {
    if (!validatePermissionForm()) return
    try {
      setSubmitting(true)
      const payload: PermissionPayload = {
        permissionName: permissionForm.permissionName,
        permissionCode: permissionForm.permissionCode,
        type: permissionForm.type,
        parentId: permissionForm.parentId,
        path: permissionForm.path,
        method: permissionForm.method,
        sort: Number(permissionForm.sort || 0)
      }
      if (formMode === 'create') {
        await createPermission(payload)
        message.success('权限创建成功')
      } else if (currentPermission) {
        await updatePermission(currentPermission.id, payload)
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

  const handlePagination = (page: number) => {
    setPagination((prev) => ({ ...prev, current: page }))
  }

  const renderTreeNodes = (nodes: TreeNode[]) => (
    <ul>
      {nodes.map((node) => (
        <li key={node.id}>
          <div className="flex items-center gap-2 py-1">
            {node.children && node.children.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() =>
                  setTreeNodes((prev) =>
                    toggleNodeExpanded(prev, node.id)
                  )
                }
              >
                {node.expanded ? '−' : '+'}
              </Button>
            )}
            {(!node.children || node.children.length === 0) && <div className="w-6" />}
            <span className="font-medium text-slate-700">{node.permissionName}</span>
            <Badge variant="secondary" className="bg-slate-100 text-xs text-slate-600">
              {node.permissionCode}
            </Badge>
            <span className="text-xs text-slate-500">{node.type}</span>
          </div>
          {node.children && node.children.length > 0 && node.expanded && (
            <div className="pl-6">{renderTreeNodes(node.children as TreeNode[])}</div>
          )}
        </li>
      ))}
    </ul>
  )

  const toggleNodeExpanded = (nodes: TreeNode[], targetId: number): TreeNode[] =>
    nodes.map((node) => {
      if (node.id === targetId) {
        return { ...node, expanded: !node.expanded }
      }
      if (node.children) {
        return { ...node, children: toggleNodeExpanded(node.children as TreeNode[], targetId) }
      }
      return node
    })

  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize))

  return (
    <div className="permission-management-page space-y-6">
      <PageHeader title="权限管理" />

      <Card>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">权限名</label>
              <Input
                placeholder="请输入权限名"
                value={searchInputs.permissionName}
                onChange={(e) => setSearchInputs((prev) => ({ ...prev, permissionName: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">权限编码</label>
              <Input
                placeholder="请输入权限编码"
                value={searchInputs.permissionCode}
                onChange={(e) => setSearchInputs((prev) => ({ ...prev, permissionCode: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">类型</label>
              <Select
                value={searchInputs.type === '' ? 'all' : searchInputs.type}
                onValueChange={(value) => setSearchInputs((prev) => ({ ...prev, type: value === 'all' ? '' : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="全部类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {typeOptions.map((option) => (
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
              <Button onClick={() => handleAction('add')}>新增权限</Button>
              <Button variant="ghost" onClick={() => handleAction('refresh')} disabled={loading}>
                刷新
              </Button>
            </div>
          </div>
      </CardContent>
    </Card>

    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>权限名</TableHead>
                <TableHead>编码</TableHead>
                <TableHead className="w-24 text-center">类型</TableHead>
                <TableHead>路径</TableHead>
                <TableHead className="w-24 text-center">方法</TableHead>
                <TableHead className="w-20 text-center">排序</TableHead>
                <TableHead className="w-40 text-center">创建时间</TableHead>
                <TableHead className="w-40 text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-sm text-slate-500">
                    数据加载中...
                  </TableCell>
                </TableRow>
              )}
              {!loading && tableRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-sm text-slate-500">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                tableRows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-slate-900">{item.permissionName}</TableCell>
                    <TableCell>{item.permissionCode}</TableCell>
                    <TableCell className="text-center">
                      {typeOptions.find((opt) => opt.value === item.type)?.label || item.type}
                    </TableCell>
                    <TableCell>{item.path || '-'}</TableCell>
                    <TableCell className="text-center">{item.method || '-'}</TableCell>
                    <TableCell className="text-center">{item.sort ?? 0}</TableCell>
                    <TableCell className="text-center text-sm text-slate-500">{item.createTime || '-'}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2 text-sm">
                        <Button variant="link" size="sm" className="px-0" onClick={() => handleTableAction('edit', item)}>
                          编辑
                        </Button>
                        <ConfirmPopover
                          title="删除权限"
                          description={`确定删除权限 ${item.permissionName} 吗？`}
                          onConfirm={() => handleDeletePermission(item)}
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

      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">权限树</h3>
            <Button variant="ghost" size="sm" onClick={loadPermissionTree} disabled={treeLoading}>
              刷新
            </Button>
          </div>
          <div className="h-[420px] overflow-auto rounded-lg border border-slate-200 p-3">
            {treeLoading ? (
              <div className="flex h-full items-center justify-center text-slate-500">权限树加载中...</div>
            ) : treeNodes.length === 0 ? (
              <div className="text-sm text-slate-500">暂无数据</div>
            ) : (
              renderTreeNodes(treeNodes)
            )}
          </div>
        </CardContent>
      </Card>
    </div>

    <Dialog open={formVisible} onOpenChange={(open) => setFormVisible(open)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{formMode === 'create' ? '新增权限' : '编辑权限'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>权限名称</Label>
            <Input
              placeholder="请输入权限名称"
              value={permissionForm.permissionName}
              onChange={(e) => setPermissionForm((prev) => ({ ...prev, permissionName: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>权限编码</Label>
            <Input
              placeholder="请输入权限编码"
              value={permissionForm.permissionCode}
              disabled={formMode === 'edit'}
              onChange={(e) => setPermissionForm((prev) => ({ ...prev, permissionCode: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>权限类型</Label>
            <Select value={permissionForm.type} onValueChange={(value) => setPermissionForm((prev) => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="请选择类型" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>上级权限</Label>
            <Select
              value={permissionForm.parentId?.toString() || 'root'}
              onValueChange={(value) =>
                setPermissionForm((prev) => ({ ...prev, parentId: value === 'root' ? undefined : Number(value) }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择上级权限" />
              </SelectTrigger>
              <SelectContent className="max-h-72 overflow-auto">
                <SelectItem value="root">顶级权限</SelectItem>
                {permissionList.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.permissionName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label>访问路径</Label>
            <Input
              placeholder="请输入访问路径"
              value={permissionForm.path}
              onChange={(e) => setPermissionForm((prev) => ({ ...prev, path: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>请求方式</Label>
            <Input
              placeholder="GET/POST/PUT..."
              value={permissionForm.method}
              onChange={(e) => setPermissionForm((prev) => ({ ...prev, method: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>排序</Label>
            <Input
              type="number"
              placeholder="请输入排序"
              value={permissionForm.sort}
              onChange={(e) => setPermissionForm((prev) => ({ ...prev, sort: e.target.value }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setFormVisible(false)} disabled={submitting}>
            取消
          </Button>
          <Button onClick={submitForm} disabled={submitting}>
            {submitting ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
)
}

export default PermissionManagement
