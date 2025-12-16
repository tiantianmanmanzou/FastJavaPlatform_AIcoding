import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import ConfirmPopover from '@/components/ui/confirm-popover'
import type { ReasoningThread, ReasoningThreadMessage } from '@/types'
import {
  appendReasoningThreadMessage,
  createReasoningThread,
  deleteReasoningThread,
  fetchReasoningThreadMessages,
  fetchReasoningThreads,
  syncReasoningThread,
  updateReasoningThread
} from '@/api/system'

interface SearchState {
  keyword: string
  status: string
  providerCode: string
}

const statusOptions = [
  { label: '准备中', value: 'READY' },
  { label: '运行中', value: 'RUNNING' },
  { label: '完成', value: 'COMPLETED' },
  { label: '异常', value: 'FAILED' }
]

const searchFields: SearchField[] = [
  { key: 'keyword', type: 'input', placeholder: '线程名称/ID' },
  { key: 'providerCode', type: 'input', placeholder: '供应商编码' },
  {
    key: 'status',
    type: 'select',
    placeholder: '状态',
    options: statusOptions
  }
]

const ThreadManagementPage: React.FC = () => {
  const [threads, setThreads] = useState<ReasoningThread[]>([])
  const [messages, setMessages] = useState<ReasoningThreadMessage[]>([])
  const [messageThread, setMessageThread] = useState<ReasoningThread | null>(null)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 })
  const [searchValues, setSearchValues] = useState<SearchState>({ keyword: '', status: '', providerCode: '' })
  const [filters, setFilters] = useState<SearchState>({ keyword: '', status: '', providerCode: '' })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formState, setFormState] = useState({ threadName: '', providerCode: '', modelName: '', metadata: '' })
  const [editing, setEditing] = useState<ReasoningThread | null>(null)
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [newMessage, setNewMessage] = useState({ role: 'user', content: '', tokenUsage: '0', latencyMillis: '0' })

  const loadThreads = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchReasoningThreads({
        page: pagination.page,
        pageSize: pagination.pageSize,
        keyword: filters.keyword || undefined,
        status: filters.status || undefined,
        providerCode: filters.providerCode || undefined
      })
      setThreads(res.data.list)
      setPagination((prev) => ({ ...prev, total: Number(res.data.total) }))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [filters.keyword, filters.providerCode, filters.status, pagination.page, pagination.pageSize])

  useEffect(() => {
    loadThreads()
  }, [loadThreads])

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }))
    setFilters(searchValues)
  }

  const handleReset = () => {
    const reset = { keyword: '', status: '', providerCode: '' }
    setSearchValues(reset)
    setFilters(reset)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const openCreateDialog = () => {
    setEditing(null)
    setFormState({ threadName: '', providerCode: '', modelName: '', metadata: '' })
    setDialogOpen(true)
  }

  const openEditDialog = (thread: ReasoningThread) => {
    setEditing(thread)
    setFormState({
      threadName: thread.threadName,
      providerCode: thread.providerCode || '',
      modelName: thread.modelName || '',
      metadata: thread.metadata || ''
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formState.threadName.trim()) {
      message.warning('请填写线程名称')
      return
    }
    try {
      setSubmitting(true)
      if (editing) {
        await updateReasoningThread(editing.id, {
          threadName: formState.threadName,
          status: editing.status,
          metadata: formState.metadata
        })
        message.success('线程已更新')
      } else {
        await createReasoningThread(formState)
        message.success('线程已创建')
      }
      setDialogOpen(false)
      setEditing(null)
      loadThreads()
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const openMessageDialog = async (thread: ReasoningThread) => {
    try {
      setMessageThread(thread)
      const res = await fetchReasoningThreadMessages(thread.id)
      setMessages(res.data)
      setNewMessage({ role: 'user', content: '', tokenUsage: '0', latencyMillis: '0' })
      setMessageDialogOpen(true)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAppendMessage = async () => {
    if (!messageThread) return
    if (!newMessage.content.trim()) {
      message.warning('请输入消息内容')
      return
    }
    try {
      await appendReasoningThreadMessage(messageThread.id, {
        role: newMessage.role,
        content: newMessage.content,
        tokenUsage: Number(newMessage.tokenUsage) || 0,
        latencyMillis: Number(newMessage.latencyMillis) || 0
      })
      const res = await fetchReasoningThreadMessages(messageThread.id)
      setMessages(res.data)
      setNewMessage({ role: newMessage.role, content: '', tokenUsage: '0', latencyMillis: newMessage.latencyMillis })
      message.success('消息已追加')
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (thread: ReasoningThread) => {
    try {
      await deleteReasoningThread(thread.id)
      message.success('线程已删除')
      loadThreads()
    } catch (error) {
      console.error(error)
    }
  }

  const handleSync = async (thread: ReasoningThread) => {
    try {
      await syncReasoningThread(thread.id)
      message.success('统计已刷新')
      loadThreads()
    } catch (error) {
      console.error(error)
    }
  }

  const stats = useMemo(() => {
    const totalTokens = threads.reduce((acc, thread) => acc + (thread.outputTokens || 0) + (thread.inputTokens || 0), 0)
    const avgLatency = threads.length === 0 ? 0 : Math.round(threads.reduce((acc, thread) => acc + (thread.latencyMillis || 0), 0) / threads.length)
    return { totalTokens, avgLatency }
  }, [threads])

  return (
    <PageContainer>
      <PageHeader title="线程管理" />

      <Card>
        <CardContent className="flex flex-col gap-4">
          <SearchBar
            fields={searchFields}
            values={searchValues}
            onValuesChange={setSearchValues}
            onSearch={handleSearch}
            onReset={handleReset}
            loading={loading}
            actions={<Button onClick={openCreateDialog}>新建线程</Button>}
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>线程名称</TableHead>
                <TableHead>线程ID</TableHead>
                <TableHead>模型</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>消息数</TableHead>
                <TableHead>Token用量</TableHead>
                <TableHead>最近活动</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {threads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-slate-500">
                    暂无线程数据
                  </TableCell>
                </TableRow>
              )}
              {threads.map((thread) => (
                <TableRow key={thread.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900">{thread.threadName}</div>
                    <div className="text-xs text-slate-500">{thread.providerCode || '-'}</div>
                  </TableCell>
                  <TableCell className="text-slate-600">{thread.threadIdentifier}</TableCell>
                  <TableCell className="text-slate-600">{thread.modelName || '-'}</TableCell>
                  <TableCell>
                    <span className="text-slate-700">{thread.status}</span>
                  </TableCell>
                  <TableCell>{thread.messageCount}</TableCell>
                  <TableCell>
                    <div className="text-xs text-slate-500">输入 {thread.inputTokens}</div>
                    <div className="text-xs text-slate-500">输出 {thread.outputTokens}</div>
                  </TableCell>
                  <TableCell>{thread.lastActivityTime ? dayjs(thread.lastActivityTime).format('MM-DD HH:mm') : '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => openMessageDialog(thread)}>
                        查看消息
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(thread)}>
                        编辑
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleSync(thread)}>
                        刷新
                      </Button>
                      <ConfirmPopover
                        title="确认删除线程?"
                        description="将删除所有关联消息"
                        onConfirm={() => handleDelete(thread)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? '编辑线程' : '新建线程'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-500">线程名称</label>
              <Input value={formState.threadName} onChange={(e) => setFormState((prev) => ({ ...prev, threadName: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm text-slate-500">供应商编码</label>
              <Input value={formState.providerCode} onChange={(e) => setFormState((prev) => ({ ...prev, providerCode: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm text-slate-500">模型名称</label>
              <Input value={formState.modelName} onChange={(e) => setFormState((prev) => ({ ...prev, modelName: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm text-slate-500">备注/元数据</label>
              <Textarea rows={3} value={formState.metadata} onChange={(e) => setFormState((prev) => ({ ...prev, metadata: e.target.value }))} />
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

      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>线程消息 - {messageThread?.threadName}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] space-y-3 overflow-auto rounded-md border border-slate-100 bg-slate-50 p-4">
            {messages.length === 0 && <div className="text-center text-sm text-slate-500">暂无消息</div>}
            {messages.map((msg) => (
              <div key={msg.id} className="rounded-md bg-white p-3 shadow-sm">
                <div className="text-xs text-slate-500">
                  {msg.role} · {msg.createdAt ? dayjs(msg.createdAt).format('MM-DD HH:mm:ss') : '-'}
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">{msg.content}</p>
                <div className="mt-2 text-xs text-slate-400">
                  Token {msg.tokenUsage || 0} · 延迟 {msg.latencyMillis || 0}ms
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="text-sm text-slate-500">角色</label>
                <Select value={newMessage.role} onValueChange={(value) => setNewMessage((prev) => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">system</SelectItem>
                    <SelectItem value="user">user</SelectItem>
                    <SelectItem value="assistant">assistant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-slate-500">Token 用量</label>
                <Input
                  value={newMessage.tokenUsage}
                  onChange={(e) => setNewMessage((prev) => ({ ...prev, tokenUsage: e.target.value }))}
                  type="number"
                  min={0}
                />
              </div>
              <div>
                <label className="text-sm text-slate-500">延迟 (ms)</label>
                <Input
                  value={newMessage.latencyMillis}
                  onChange={(e) => setNewMessage((prev) => ({ ...prev, latencyMillis: e.target.value }))}
                  type="number"
                  min={0}
                />
              </div>
            </div>
            <Textarea
              placeholder="输入要追加的消息内容"
              rows={3}
              value={newMessage.content}
              onChange={(e) => setNewMessage((prev) => ({ ...prev, content: e.target.value }))}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
              关闭
            </Button>
            <Button onClick={handleAppendMessage}>追加消息</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}

export default ThreadManagementPage
