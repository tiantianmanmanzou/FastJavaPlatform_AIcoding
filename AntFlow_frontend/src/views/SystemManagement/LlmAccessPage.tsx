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
import {
  createLlmProvider,
  deleteLlmProvider,
  fetchLlmParamTemplates,
  fetchLlmProviderDetail,
  fetchLlmProviders,
  markLlmProviderDefault,
  updateLlmProvider
} from '@/api/system'
import type { LlmParamTemplate, LlmProviderPayload } from '@/api/system'
import type { LlmProvider } from '@/types'

interface SearchState {
  keyword: string
  status: string
  providerType: string
}

interface FormState {
  providerCode: string
  providerName: string
  providerType: string
  vendor: string
  modelName: string
  baseUrl: string
  apiKey: string
  apiVersion: string
  status: string
  defaultFlag: number
  concurrencyLimit: string
  timeoutSeconds: string
  capabilityTags: string
  description: string
  metadata: string
  apiParams: Record<string, string>
}

const createDefaultFormState = (): FormState => ({
  providerCode: '',
  providerName: '',
  providerType: '',
  vendor: '',
  modelName: '',
  baseUrl: '',
  apiKey: '',
  apiVersion: '',
  status: '1',
  defaultFlag: 0,
  concurrencyLimit: '5',
  timeoutSeconds: '30',
  capabilityTags: '',
  description: '',
  metadata: '',
  apiParams: {}
})

const providerTypeOptions = [
  { label: '通用文本模型', value: 'TEXT_GENERATION' },
  { label: '图像生成', value: 'IMAGE_GENERATION' },
  { label: '推理模型', value: 'REASONING' }
]

const textVendorSet = new Set<string>(['DOUBAO', 'KIMI', 'QWEN', 'GLM', 'OPENAI'])

const vendorOptions = [
  { label: '豆包 Doubao', value: 'DOUBAO' },
  { label: 'Kimi (Moonshot)', value: 'KIMI' },
  { label: '千问 Qwen', value: 'QWEN' },
  { label: '智谱 GLM', value: 'GLM' },
  { label: 'OpenAI', value: 'OPENAI' },
  { label: '谷歌 Imagen', value: 'GOOGLE' },
  { label: 'MiniMax', value: 'MINIMAX' }
]

const statusOptions = [
  { label: '启用', value: '1' },
  { label: '停用', value: '0' }
]

const searchFields: SearchField[] = [
  { key: 'keyword', type: 'input', placeholder: '名称/编码/模型' },
  {
    key: 'providerType',
    type: 'select',
    placeholder: '模型类型',
    options: providerTypeOptions
  },
  {
    key: 'status',
    type: 'select',
    placeholder: '状态',
    options: statusOptions
  }
]

const LlmAccessPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [providers, setProviders] = useState<LlmProvider[]>([])
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 })
  const [searchValues, setSearchValues] = useState<SearchState>({ keyword: '', status: '', providerType: '' })
  const [filters, setFilters] = useState<SearchState>({ keyword: '', status: '', providerType: '' })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formState, setFormState] = useState<FormState>(createDefaultFormState())
  const [editing, setEditing] = useState<LlmProvider | null>(null)
  const [paramTemplates, setParamTemplates] = useState<LlmParamTemplate[]>([])
  const [paramLoading, setParamLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [copyingId, setCopyingId] = useState<number | null>(null)

  const loadProviders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchLlmProviders({
        page: pagination.page,
        pageSize: pagination.pageSize,
        keyword: filters.keyword || undefined,
        status: filters.status === '' ? undefined : Number(filters.status),
        providerType: filters.providerType || undefined
      })
      setProviders(res.data.list)
      setPagination((prev) => ({ ...prev, total: Number(res.data.total) }))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [filters.keyword, filters.providerType, filters.status, pagination.page, pagination.pageSize])

  useEffect(() => {
    loadProviders()
  }, [loadProviders])

  useEffect(() => {
    if (!dialogOpen) {
      setParamTemplates([])
      return
    }
    if (!formState.vendor || !formState.providerType) {
      setParamTemplates([])
      setFormState((prev) => ({ ...prev, apiParams: {} }))
      return
    }
    let cancelled = false
    setParamLoading(true)
    fetchLlmParamTemplates(formState.vendor, formState.providerType)
      .then((res) => {
        if (cancelled) return
        const templates = res.data || []
        setParamTemplates(templates)
        setFormState((prev) => {
          const allowedKeys = new Set(templates.map((tpl) => tpl.paramKey))
          const nextParams: Record<string, string> = {}
          allowedKeys.forEach((key) => {
            if (prev.apiParams[key] !== undefined) {
              nextParams[key] = prev.apiParams[key]
            } else {
              const tpl = templates.find((item) => item.paramKey === key)
              if (tpl?.defaultValue) {
                nextParams[key] = tpl.defaultValue
              }
            }
          })
          return { ...prev, apiParams: nextParams }
        })
      })
      .catch((err) => {
        console.error(err)
        if (!cancelled) {
          message.error('加载参数模板失败')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setParamLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [dialogOpen, formState.vendor, formState.providerType])

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }))
    setFilters(searchValues)
  }

  const handleReset = () => {
    setSearchValues({ keyword: '', status: '', providerType: '' })
    setFilters({ keyword: '', status: '', providerType: '' })
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const openCreateDialog = () => {
    setEditing(null)
    setFormState(createDefaultFormState())
    setFormLoading(false)
    setDialogOpen(true)
  }

  const openEditDialog = async (record: LlmProvider) => {
    if (!record.id) return
    setEditing(record)
    setFormState(createDefaultFormState())
    setDialogOpen(true)
    setFormLoading(true)
    try {
      const res = await fetchLlmProviderDetail(record.id)
      const detail = res.data
      if (!detail) {
        throw new Error('Empty provider detail')
      }
      setEditing(detail)
      setFormState({
        providerCode: detail.providerCode || '',
        providerName: detail.providerName || '',
        providerType: detail.providerType || '',
        vendor: detail.vendor || '',
        modelName: detail.modelName || '',
        baseUrl: detail.baseUrl || '',
        apiKey: detail.apiKey || '',
        apiVersion: detail.apiVersion || '',
        status: String(detail.status ?? 0),
        defaultFlag: detail.defaultFlag ?? 0,
        concurrencyLimit: String(detail.concurrencyLimit ?? 5),
        timeoutSeconds: String(detail.timeoutSeconds ?? 30),
        capabilityTags: detail.capabilityTags || '',
        description: detail.description || '',
        metadata: detail.metadata || '',
        apiParams: detail.apiParams || {}
      })
    } catch (error) {
      console.error(error)
      message.error('加载模型详情失败')
      setDialogOpen(false)
      setEditing(null)
    } finally {
      setFormLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formState.providerCode.trim() || !formState.providerName.trim()) {
      message.warning('请输入完整的基础信息')
      return
    }
    if (!formState.providerType) {
      message.warning('请选择模型类型')
      return
    }
    try {
      setSubmitting(true)
      const payload: LlmProviderPayload = {
        ...formState,
        status: Number(formState.status),
        defaultFlag: Number(formState.defaultFlag) || 0,
        concurrencyLimit: Number(formState.concurrencyLimit) || 5,
        timeoutSeconds: Number(formState.timeoutSeconds) || 30
      }
      const trimmedKey = formState.apiKey.trim()
      if (trimmedKey) {
        payload.apiKey = trimmedKey
      } else if (editing) {
        delete payload.apiKey
      }
      if (!editing && !trimmedKey) {
        message.warning('请输入 API Key')
        setSubmitting(false)
        return
      }
      if (editing) {
        await updateLlmProvider(editing.id, payload)
        message.success('已更新模型配置')
      } else {
        await createLlmProvider(payload)
        message.success('已创建模型配置')
      }
      setDialogOpen(false)
      setEditing(null)
      setFormState(createDefaultFormState())
      loadProviders()
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (item: LlmProvider) => {
    if (!item.id) return
    try {
      await deleteLlmProvider(item.id)
      message.success('已删除模型配置')
      loadProviders()
    } catch (error) {
      console.error(error)
    }
  }

  const handleMarkDefault = async (item: LlmProvider) => {
    if (!item.id) return
    try {
      await markLlmProviderDefault(item.id)
      message.success('已设为默认模型')
      loadProviders()
    } catch (error) {
      console.error(error)
    }
  }

  const handleCopy = async (item: LlmProvider) => {
    if (!item.id || copyingId !== null) return
    setCopyingId(item.id)
    try {
      const res = await fetchLlmProviderDetail(item.id)
      const detail = res.data
      if (!detail) {
        throw new Error('Empty provider detail')
      }
      const timestamp = Date.now()
      const payload: LlmProviderPayload = {
        providerCode: `${detail.providerCode || 'provider'}_${timestamp}`,
        providerName: `${detail.providerName || '模型'}复制`,
        providerType: detail.providerType || '',
        vendor: detail.vendor || undefined,
        modelName: detail.modelName || undefined,
        baseUrl: detail.baseUrl || undefined,
        apiKey: detail.apiKey || undefined,
        apiVersion: detail.apiVersion || undefined,
        status: detail.status ?? 0,
        defaultFlag: 0,
        concurrencyLimit: detail.concurrencyLimit ?? 5,
        timeoutSeconds: detail.timeoutSeconds ?? 30,
        capabilityTags: detail.capabilityTags || undefined,
        description: detail.description || undefined,
        metadata: detail.metadata || undefined,
        apiParams: detail.apiParams || {}
      }
      await createLlmProvider(payload)
      message.success('已复制模型配置')
      loadProviders()
    } catch (error) {
      console.error(error)
      message.error('复制模型失败')
    } finally {
      setCopyingId(null)
    }
  }

  const summary = useMemo(() => {
    const enabled = providers.filter((item) => item.status === 1).length
    const defaults = providers.filter((item) => item.defaultFlag === 1)
    return { enabled, defaultCode: defaults[0]?.providerCode }
  }, [providers])

  return (
    <PageContainer>
      <PageHeader title="大模型接入" />

      <Card>
        <CardContent className="flex flex-col gap-4">
          <SearchBar
            fields={searchFields}
            values={searchValues}
            onValuesChange={setSearchValues}
            onSearch={handleSearch}
            onReset={handleReset}
            loading={loading}
            actions={<Button onClick={openCreateDialog}>新增模型</Button>}
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>模型名称</TableHead>
                <TableHead>编码</TableHead>
                <TableHead>厂商</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>并发/超时</TableHead>
                <TableHead>最近同步</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-slate-500">
                    暂无模型配置
                  </TableCell>
                </TableRow>
              )}
              {providers.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900">{item.providerName}</div>
                    <div className="text-xs text-slate-500">{item.modelName || '-'}</div>
                  </TableCell>
                  <TableCell className="text-slate-600">{item.providerCode}</TableCell>
                  <TableCell className="text-slate-600">
                    {vendorOptions.find(v => v.value === item.vendor)?.label || item.vendor || '-'}
                  </TableCell>
                  <TableCell className="text-slate-600">{item.providerType}</TableCell>
                  <TableCell className="text-slate-600">{item.defaultFlag === 1 ? '是' : '否'}</TableCell>
                  <TableCell>
                    <span className={item.status === 1 ? 'text-emerald-600' : 'text-slate-400'}>
                      {item.status === 1 ? '启用' : '停用'}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {item.concurrencyLimit || 0} / {item.timeoutSeconds || 0}s
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {item.lastSyncedAt ? dayjs(item.lastSyncedAt).format('YYYY-MM-DD HH:mm') : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                        编辑
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleCopy(item)} disabled={copyingId === item.id}>
                        {copyingId === item.id ? '复制中...' : '复制'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleMarkDefault(item)} disabled={item.defaultFlag === 1}>
                        设为默认
                      </Button>
                      <ConfirmPopover
                        title="确认删除该模型?"
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
        <DialogContent className="sm:max-w-[1200px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editing ? '编辑模型' : '新增模型'}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-2">
            {formLoading ? (
              <div className="py-20 text-center text-slate-500">模型数据加载中...</div>
            ) : (
              <>
            <div className="max-w-5xl mx-auto grid gap-4 py-2 md:grid-cols-2">
              <div>
                <label className="text-sm text-slate-500">模型厂商</label>
                <Select
                  value={formState.vendor}
                  onValueChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      vendor: value,
                      providerType: textVendorSet.has(value) ? 'TEXT_GENERATION' : prev.providerType
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择厂商" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-slate-500">生成内容类型</label>
                <Select
                  value={formState.providerType}
                  onValueChange={(value) => setFormState((prev) => ({ ...prev, providerType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {providerTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-slate-500">模型名称</label>
                <Input
                  value={formState.providerName}
                  onChange={(e) => setFormState((prev) => ({ ...prev, providerName: e.target.value }))}
                  placeholder="例如：OpenAI GPT-4o"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500">模型编码</label>
                <Input
                  value={formState.providerCode}
                  onChange={(e) => setFormState((prev) => ({ ...prev, providerCode: e.target.value }))}
                  placeholder="唯一编码"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500">接口地址</label>
                <Input
                  value={formState.baseUrl}
                  onChange={(e) => setFormState((prev) => ({ ...prev, baseUrl: e.target.value }))}
                  placeholder="https://api.example.com"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500">API Key</label>
                <Input
                  value={formState.apiKey}
                  onChange={(e) => setFormState((prev) => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="密钥，仅本地存储"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500">状态</label>
                <Select
                  value={formState.status}
                  onValueChange={(value) => setFormState((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-slate-500">默认模型</label>
                <Select
                  value={String(formState.defaultFlag)}
                  onValueChange={(value) => setFormState((prev) => ({ ...prev, defaultFlag: Number(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">是</SelectItem>
                    <SelectItem value="0">否</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-slate-500">模型标识</label>
                <Input
                  value={formState.modelName}
                  onChange={(e) => setFormState((prev) => ({ ...prev, modelName: e.target.value }))}
                  placeholder="gpt-4o-mini 等"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500">API版本</label>
                <Input
                  value={formState.apiVersion}
                      onChange={(e) => setFormState((prev) => ({ ...prev, apiVersion: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-500">并发限制</label>
                    <Input
                      value={formState.concurrencyLimit}
                      onChange={(e) => setFormState((prev) => ({ ...prev, concurrencyLimit: e.target.value }))}
                      type="number"
                      min={1}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-500">超时时间(秒)</label>
                    <Input
                      value={formState.timeoutSeconds}
                      onChange={(e) => setFormState((prev) => ({ ...prev, timeoutSeconds: e.target.value }))}
                      type="number"
                      min={5}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-500">能力标签</label>
                    <Input
                      value={formState.capabilityTags}
                      onChange={(e) => setFormState((prev) => ({ ...prev, capabilityTags: e.target.value }))}
                      placeholder="用逗号分隔"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-slate-500">描述</label>
                    <Textarea
                      value={formState.description}
                      onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-500">备注/元数据</label>
                    <Textarea
                      value={formState.metadata}
                      onChange={(e) => setFormState((prev) => ({ ...prev, metadata: e.target.value }))}
                      rows={3}
                      placeholder="JSON 或备注信息"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter className="mt-4 px-6">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit} disabled={submitting || formLoading}>
              {submitting ? '提交中...' : '保存'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}

export default LlmAccessPage
