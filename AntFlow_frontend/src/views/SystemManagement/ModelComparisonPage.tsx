import React, { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import PageContainer from '@/components/ui/page-container'
import PageHeader from '@/components/ui/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SearchBar, { type SearchField } from '@/components/ui/search-bar'
import { message } from '@/lib/message'
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
import ConfirmPopover from '@/components/ui/confirm-popover'
import {
  createModelComparison,
  deleteModelComparison,
  fetchModelComparisons,
  runModelComparison,
  updateModelComparison
} from '@/api/system'
import type { ModelComparison } from '@/types'

interface SearchState {
  keyword: string
  status: string
}

const statusOptions = [
  { label: '待执行', value: 'PENDING' },
  { label: '运行中', value: 'RUNNING' },
  { label: '完成', value: 'COMPLETED' }
]

const searchFields: SearchField[] = [
  { key: 'keyword', type: 'input', placeholder: '名称/提示词关键字' },
  {
    key: 'status',
    type: 'select',
    placeholder: '状态',
    options: statusOptions
  }
]

const defaultFormState = {
  comparisonName: '',
  prompt: '',
  providerA: '',
  modelA: '',
  providerB: '',
  modelB: '',
  evaluationCriteria: '准确性,速度,成本',
  createdBy: ''
}

const ModelComparisonPage: React.FC = () => {
  const [comparisons, setComparisons] = useState<ModelComparison[]>([])
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 })
  const [searchValues, setSearchValues] = useState<SearchState>({ keyword: '', status: '' })
  const [filters, setFilters] = useState<SearchState>({ keyword: '', status: '' })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formState, setFormState] = useState(defaultFormState)
  const [editing, setEditing] = useState<ModelComparison | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const loadComparisons = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchModelComparisons({
        page: pagination.page,
        pageSize: pagination.pageSize,
        keyword: filters.keyword || undefined,
        status: filters.status || undefined
      })
      setComparisons(res.data.list)
      setPagination((prev) => ({ ...prev, total: Number(res.data.total) }))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [filters.keyword, filters.status, pagination.page, pagination.pageSize])

  useEffect(() => {
    loadComparisons()
  }, [loadComparisons])

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }))
    setFilters(searchValues)
  }

  const handleReset = () => {
    const reset = { keyword: '', status: '' }
    setSearchValues(reset)
    setFilters(reset)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const openCreateDialog = () => {
    setEditing(null)
    setFormState(defaultFormState)
    setDialogOpen(true)
  }

  const openEditDialog = (record: ModelComparison) => {
    setEditing(record)
    setFormState({
      comparisonName: record.comparisonName,
      prompt: record.prompt,
      providerA: record.providerA || '',
      modelA: record.modelA || '',
      providerB: record.providerB || '',
      modelB: record.modelB || '',
      evaluationCriteria: record.evaluationCriteria || '',
      createdBy: record.createdBy || ''
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formState.comparisonName.trim() || !formState.prompt.trim()) {
      message.warning('请填写对比名称和提示词')
      return
    }
    try {
      setSubmitting(true)
      if (editing) {
        await updateModelComparison(editing.id, formState)
        message.success('模型对比已更新')
      } else {
        await createModelComparison(formState)
        message.success('模型对比已创建')
      }
      setDialogOpen(false)
      setEditing(null)
      loadComparisons()
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (record: ModelComparison) => {
    try {
      await deleteModelComparison(record.id)
      message.success('记录已删除')
      loadComparisons()
    } catch (error) {
      console.error(error)
    }
  }

  const handleRun = async (record: ModelComparison) => {
    try {
      await runModelComparison(record.id)
      message.success('对比任务已执行')
      loadComparisons()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <PageContainer>
      <PageHeader title="模型对比" />

      <Card>
        <CardContent className="flex flex-col gap-4">
          <SearchBar
            fields={searchFields}
            values={searchValues}
            onValuesChange={setSearchValues}
            onSearch={handleSearch}
            onReset={handleReset}
            loading={loading}
            actions={<Button onClick={openCreateDialog}>新建对比</Button>}
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>对比名称</TableHead>
                <TableHead>模型A</TableHead>
                <TableHead>模型B</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>得分</TableHead>
                <TableHead>结论</TableHead>
                <TableHead>更新时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisons.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-slate-500">
                    暂无对比记录
                  </TableCell>
                </TableRow>
              )}
              {comparisons.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900">{item.comparisonName}</div>
                    <div className="text-xs text-slate-500 line-clamp-1">{item.prompt}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-900">{item.modelA || '-'}</div>
                    <div className="text-xs text-slate-500">{item.providerA || '-'}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-900">{item.modelB || '-'}</div>
                    <div className="text-xs text-slate-500">{item.providerB || '-'}</div>
                  </TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <div className="text-sm text-emerald-600">A: {item.scoreA ?? '-'}</div>
                    <div className="text-sm text-sky-600">B: {item.scoreB ?? '-'}</div>
                  </TableCell>
                  <TableCell>{item.winner || '-'}</TableCell>
                  <TableCell>{item.updateTime ? dayjs(item.updateTime).format('YYYY-MM-DD HH:mm') : '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                        编辑
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleRun(item)}>
                        执行
                      </Button>
                      <ConfirmPopover
                        title="确认删除记录?"
                        description="该操作不可恢复"
                        onConfirm={() => handleDelete(item)}
                      >
                        <Button variant="destructive" size="sm">
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? '编辑对比任务' : '新建对比任务'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-500">对比名称</label>
              <Input value={formState.comparisonName} onChange={(e) => setFormState((prev) => ({ ...prev, comparisonName: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm text-slate-500">创建人</label>
              <Input value={formState.createdBy} onChange={(e) => setFormState((prev) => ({ ...prev, createdBy: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm text-slate-500">供应商A</label>
              <Input value={formState.providerA} onChange={(e) => setFormState((prev) => ({ ...prev, providerA: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm text-slate-500">模型A</label>
              <Input value={formState.modelA} onChange={(e) => setFormState((prev) => ({ ...prev, modelA: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm text-slate-500">供应商B</label>
              <Input value={formState.providerB} onChange={(e) => setFormState((prev) => ({ ...prev, providerB: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm text-slate-500">模型B</label>
              <Input value={formState.modelB} onChange={(e) => setFormState((prev) => ({ ...prev, modelB: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-500">提示词</label>
              <Textarea rows={4} value={formState.prompt} onChange={(e) => setFormState((prev) => ({ ...prev, prompt: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm text-slate-500">评价维度</label>
              <Textarea
                rows={3}
                value={formState.evaluationCriteria}
                onChange={(e) => setFormState((prev) => ({ ...prev, evaluationCriteria: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? '提交中...' : '保存'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}

export default ModelComparisonPage
