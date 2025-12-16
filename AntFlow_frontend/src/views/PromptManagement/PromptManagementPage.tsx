import React, { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import PageHeader from '@/components/ui/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SearchBar, { type SearchField } from '@/components/ui/search-bar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import ConfirmPopover from '@/components/ui/confirm-popover'
import { message } from '@/lib/message'
import type { PromptItem, PromptType } from '@/types'
import { createPrompt, deletePrompt, fetchPrompts, updatePrompt } from '@/api/prompt'
import { emitPromptDataUpdated } from '@/lib/promptEvents'
import './PromptManagementPage.scss'

const typeOptions: Array<{ label: string; value: PromptType }> = [
  { label: '图片提示词', value: 'IMAGE' },
  { label: '文章提示词', value: 'ARTICLE' },
  { label: '视频提示词', value: 'VIDEO' }
]

const searchFields: SearchField[] = [
  { key: 'keyword', type: 'input', placeholder: '提示词名称' },
  { key: 'type', type: 'select', placeholder: '提示词类型', options: typeOptions }
]

const PromptManagementPage: React.FC = () => {
  const [prompts, setPrompts] = useState<PromptItem[]>([])
  const [filters, setFilters] = useState({ keyword: '', type: '' })
  const [searchValues, setSearchValues] = useState({ keyword: '', type: '' })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<PromptItem | null>(null)
  const [formValues, setFormValues] = useState({ name: '', content: '', type: 'IMAGE' as PromptType })
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)

  const loadPrompts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchPrompts({
        keyword: filters.keyword || undefined,
        type: filters.type || undefined
      })
      setPrompts(res.data || [])
    } catch (error) {
      console.error(error)
      message.error('提示词加载失败')
    } finally {
      setLoading(false)
    }
  }, [filters.keyword, filters.type])

  useEffect(() => {
    loadPrompts()
  }, [loadPrompts])

  const filteredPrompts = useMemo(() => {
    let list = prompts
    if (filters.keyword) {
      const lower = filters.keyword.toLowerCase()
      list = list.filter((item) => item.name.toLowerCase().includes(lower))
    }
    if (filters.type) {
      list = list.filter((item) => item.type === filters.type)
    }
    return list
  }, [filters.keyword, filters.type, prompts])

  const handleSearch = () => {
    setFilters(searchValues)
  }

  const handleReset = () => {
    const reset = { keyword: '', type: '' }
    setSearchValues(reset)
    setFilters(reset)
  }

  const openCreateDialog = () => {
    setEditing(null)
    setFormValues({ name: '', content: '', type: 'IMAGE' })
    setDialogOpen(true)
  }

  const openEditDialog = (item: PromptItem) => {
    setEditing(item)
    setFormValues({ name: item.name, content: item.content, type: item.type })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formValues.name.trim()) {
      message.warning('请输入提示词名称')
      return
    }
    if (!formValues.content.trim()) {
      message.warning('请输入提示词内容')
      return
    }
    try {
      setSubmitting(true)
      if (editing) {
        await updatePrompt(editing.id, {
          name: formValues.name.trim(),
          content: formValues.content.trim(),
          type: formValues.type
        })
        message.success('提示词已更新')
      } else {
        await createPrompt({
          name: formValues.name.trim(),
          content: formValues.content.trim(),
          type: formValues.type
        })
        message.success('提示词已创建')
      }
      setDialogOpen(false)
      setEditing(null)
      emitPromptDataUpdated()
      await loadPrompts()
    } catch (error) {
      console.error(error)
      message.error('保存失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePrompt = async (prompt: PromptItem) => {
    try {
      await deletePrompt(prompt.id)
      message.success('提示词已删除')
      emitPromptDataUpdated()
      await loadPrompts()
    } catch (error) {
      console.error(error)
      message.error('删除失败，请稍后重试')
    }
  }

  const closeDialog = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditing(null)
    }
  }

  return (
    <div className="prompt-management-page space-y-6">
      <PageHeader title="提示词管理" />

      <Card>
        <CardContent className="space-y-4">
          <SearchBar
            fields={searchFields}
            values={searchValues}
            onValuesChange={setSearchValues}
            onSearch={handleSearch}
            onReset={handleReset}
            loading={loading}
            actions={<Button onClick={openCreateDialog}>新增提示词</Button>}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>提示词名称</TableHead>
                <TableHead className="w-32 text-center">类型</TableHead>
                <TableHead>提示词内容</TableHead>
                <TableHead className="w-40 text-center">更新时间</TableHead>
                <TableHead className="w-40 text-center">创建时间</TableHead>
                <TableHead className="w-32 text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-slate-500">
                    加载中...
                  </TableCell>
                </TableRow>
              )}
              {!loading && filteredPrompts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-slate-500">
                    暂无提示词数据
                  </TableCell>
                </TableRow>
              )}
              {filteredPrompts.map((prompt) => (
                <TableRow key={prompt.id}>
                  <TableCell className="font-medium text-slate-900">{prompt.name}</TableCell>
                  <TableCell className="text-center text-slate-600">
                    {typeOptions.find((item) => item.value === prompt.type)?.label || prompt.type}
                  </TableCell>
                  <TableCell>
                    <p className="max-w-2xl text-sm text-slate-600 line-clamp-2">{prompt.content}</p>
                  </TableCell>
                  <TableCell className="text-center text-sm text-slate-500">
                    {dayjs(prompt.updateTime).format('YYYY-MM-DD HH:mm')}
                  </TableCell>
                  <TableCell className="text-center text-sm text-slate-500">
                    {dayjs(prompt.createTime).format('YYYY-MM-DD HH:mm')}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2 text-sm">
                      <Button variant="link" size="sm" className="px-0" onClick={() => openEditDialog(prompt)}>
                        编辑
                      </Button>
                      <ConfirmPopover
                        title="删除提示词"
                        description={`确定删除提示词 ${prompt.name} 吗？`}
                        onConfirm={() => handleDeletePrompt(prompt)}
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
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? '编辑提示词' : '新增提示词'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">提示词名称</label>
              <Input value={formValues.name} onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))} placeholder="请输入提示词名称" maxLength={60} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">提示词类型</label>
              <Select value={formValues.type} onValueChange={(value) => setFormValues((prev) => ({ ...prev, type: value as PromptType }))}>
                <SelectTrigger>
                  <SelectValue placeholder="选择类型" />
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">提示词内容</label>
              <Textarea
                rows={6}
                value={formValues.content}
                onChange={(e) => setFormValues((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="请输入提示词内容，可包含场景、风格、限制等"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => closeDialog(false)} disabled={submitting}>
              取消
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? '保存中...' : '保存提示词'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PromptManagementPage
