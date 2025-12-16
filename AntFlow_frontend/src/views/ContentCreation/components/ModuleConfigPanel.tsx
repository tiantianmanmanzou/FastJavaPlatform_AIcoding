import React, { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select'
import type { ContentModuleItem, ContentTemplateItem, ContentApiVendor, PromptItem, PromptType, ContentModuleType, LlmProvider } from '../../../types'
import SubjectImageSelector from './SubjectImageSelector'
import { cn } from '@/lib/utils'
import { fetchLlmProviders } from '@/api/system'
import { fetchPrompts } from '@/api/prompt'
import { PROMPT_DATA_UPDATED_EVENT } from '@/lib/promptEvents'

interface ModuleConfigPanelProps {
  module?: ContentModuleItem | null
  templates: ContentTemplateItem[]
  templatesLoading?: boolean
  onSave: (payload: Partial<ContentModuleItem>) => Promise<void>
  onApplyTemplate: (templateId: number) => Promise<void>
  onSaveTemplate: (templateName: string) => Promise<void>
  onConfigChange?: (moduleId: number, payload: Partial<ContentModuleItem>) => void
  saving?: boolean
  creatingTemplate?: boolean
  productImages?: string[]
  defaultSubjectImage?: string
}

const vendorOptions: { label: string; value: ContentApiVendor }[] = [
  { label: '豆包 Doubao', value: 'DOUBAO' },
  { label: 'Kimi (Moonshot)', value: 'KIMI' },
  { label: '千问 Qwen', value: 'QWEN' },
  { label: '智谱 GLM', value: 'GLM' },
  { label: 'OpenAI', value: 'OPENAI' },
  { label: '谷歌', value: 'GOOGLE' },
  { label: 'MiniMax', value: 'MINIMAX' }
]

const ModuleConfigPanel: React.FC<ModuleConfigPanelProps> = ({
  module,
  templates,
  templatesLoading,
  onSave,
  onApplyTemplate,
  onSaveTemplate,
  onConfigChange,
  saving,
  creatingTemplate,
  productImages,
  defaultSubjectImage
}) => {
  const [config, setConfig] = useState<Partial<ContentModuleItem>>({})
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [promptOptions, setPromptOptions] = useState<PromptItem[]>([])
  const [selectedPromptId, setSelectedPromptId] = useState<string>('')
  const [llmProviders, setLlmProviders] = useState<LlmProvider[]>([])
  const [promptLoading, setPromptLoading] = useState(false)

  useEffect(() => {
    if (module) {
      setConfig({ ...module })
      setSelectedTemplate('')
      setSelectedPromptId('')
    }
  }, [module])

  useEffect(() => {
    if (module?.moduleType !== 'IMAGE') {
      return
    }
    // 只在 module 首次加载且没有 subjectImageUrl 时设置默认值
    if (!module.subjectImageUrl && defaultSubjectImage) {
      setConfig((prev) => {
        if (prev.subjectImageUrl) {
          return prev
        }
        return { ...prev, subjectImageUrl: defaultSubjectImage }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module?.id])

  // 移除了这个会导致无限循环的 useEffect
  // onConfigChange 会在 handleChange 中直接调用

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const res = await fetchLlmProviders({
          page: 1,
          pageSize: 200,
          providerType: 'IMAGE_GENERATION',
          status: 1
        })
        setLlmProviders(res.data.list || [])
      } catch (error) {
        console.error('Failed to load LLM providers', error)
      }
    }
    loadProviders()
  }, [])

  const promptTypeMap: Record<ContentModuleType, PromptType> = {
    IMAGE: 'IMAGE',
    ARTICLE: 'ARTICLE',
    VIDEO: 'VIDEO'
  }

  useEffect(() => {
    if (!module) {
      setPromptOptions([])
      setPromptLoading(false)
      return
    }
    let cancelled = false
    const refreshPrompts = async () => {
      const promptType = promptTypeMap[module.moduleType]
      if (!promptType) {
        if (!cancelled) {
          setPromptOptions([])
        }
        return
      }
      setPromptLoading(true)
      try {
        const res = await fetchPrompts({ type: promptType })
        if (!cancelled) {
          setPromptOptions(res.data || [])
        }
      } catch (error) {
        console.error('Failed to load prompts', error)
        if (!cancelled) {
          setPromptOptions([])
        }
      } finally {
        if (!cancelled) {
          setPromptLoading(false)
        }
      }
    }

    refreshPrompts()

    if (typeof window === 'undefined') {
      return
    }

    const handler = () => {
      refreshPrompts()
    }
    window.addEventListener(PROMPT_DATA_UPDATED_EVENT, handler as EventListener)
    return () => {
      cancelled = true
      window.removeEventListener(PROMPT_DATA_UPDATED_EVENT, handler as EventListener)
    }
  }, [module?.id, module?.moduleType])

  const updateConfigState = (updater: (prev: Partial<ContentModuleItem>) => Partial<ContentModuleItem>) => {
    setConfig((prev) => {
      const next = updater(prev)
      if (module && onConfigChange) {
        onConfigChange(module.id, next)
      }
      return next
    })
  }

  const providersByVendor = useMemo(() => {
    return llmProviders.reduce((acc, provider) => {
      if (!provider.vendor) {
        return acc
      }
      const vendorKey = provider.vendor.toUpperCase()
      if (!acc[vendorKey]) {
        acc[vendorKey] = []
      }
      acc[vendorKey].push(provider)
      return acc
    }, {} as Record<string, LlmProvider[]>)
  }, [llmProviders])

  useEffect(() => {
    if (!module || module.moduleType !== 'IMAGE') {
      return
    }
    if (!productImages || productImages.length === 0) {
      return
    }
    const current = config.subjectImageUrl
    if (current && productImages.includes(current)) {
      return
    }
    const fallback = productImages[0]
    if (!fallback) {
      return
    }
    updateConfigState((prev) => ({ ...prev, subjectImageUrl: fallback }))
  }, [module?.id, module?.moduleType, productImages, config.subjectImageUrl])

  useEffect(() => {
    if (!module) {
      return
    }
    const vendorKey = (config.apiVendor as ContentApiVendor) || undefined
    if (!vendorKey) {
      return
    }
    const vendorProviders = providersByVendor[vendorKey] || []
    if (vendorProviders.length === 0) {
      if (config.apiName) {
        updateConfigState((prev) => ({ ...prev, apiName: undefined }))
      }
      return
    }
    const exists = config.apiName && vendorProviders.some((item) => item.providerCode === config.apiName)
    if (!exists) {
      updateConfigState((prev) => ({ ...prev, apiName: vendorProviders[0].providerCode }))
    }
  }, [module?.id, config.apiVendor, config.apiName, providersByVendor])

  if (!module) {
    return (
      <div className="cc-config-panel empty">
        <div className="placeholder">
          <span role="img" aria-label="empty">
            (・ω・)
          </span>
          <p>请在中间画布选择模块</p>
        </div>
      </div>
    )
  }

  const handleChange = (field: keyof ContentModuleItem, value: any) => {
    updateConfigState((prev) => ({ ...prev, [field]: value }))
  }

  const handleVendorChange = (value: ContentApiVendor) => {
    const availableApis = providersByVendor[value] || []
    updateConfigState((prev) => {
      const preserved = prev.apiName && availableApis.some((item) => item.providerCode === prev.apiName)
        ? prev.apiName
        : availableApis[0]?.providerCode
      return {
        ...prev,
        apiVendor: value,
        apiName: preserved || undefined
      }
    })
  }

  const currentVendor: ContentApiVendor = (config.apiVendor as ContentApiVendor) || 'GOOGLE'
  const vendorApiEntries = providersByVendor[currentVendor] || []

  const handleSave = async () => {
    await onSave({
      moduleTitle: config.moduleTitle,
      prompt: config.prompt,
      tone: config.tone,
      style: config.style,
      contentLength: config.contentLength,
      imageStyle: config.imageStyle,
      imageRatio: config.imageRatio,
      imageQuantity: config.imageQuantity,
      videoStyle: config.videoStyle,
      videoRatio: config.videoRatio,
      videoDuration: config.videoDuration,
      subjectImageUrl: config.subjectImageUrl,
      apiVendor: config.apiVendor,
      apiName: config.apiName
    })
  }

  const handleApplyTemplate = async () => {
    if (!selectedTemplate) return
    await onApplyTemplate(Number(selectedTemplate))
  }

  const handleSaveTemplate = async () => {
    const name = window.prompt('请输入模板名称', `${module.moduleTitle}模板`)
    if (name) {
      await onSaveTemplate(name.trim())
    }
  }

  const handlePromptSelect = (value: string) => {
    if (value === '__manual__') {
      setSelectedPromptId('')
      return
    }
    setSelectedPromptId(value)
    const target = promptOptions.find((item) => String(item.id) === value)
    if (target) {
      handleChange('prompt', target.content)
    }
  }

  const renderModuleSpecificFields = () => {
    if (module.moduleType === 'IMAGE') {
      return (
        <>
          <NumberField
            label="图片数量"
            value={config.imageQuantity ?? 3}
            min={1}
            max={8}
            onChange={(value) => handleChange('imageQuantity', value)}
          />
        </>
      )
    }
    if (module.moduleType === 'ARTICLE') {
      return (
        <>
          <SelectField
            label="文章风格"
            value={config.tone || ''}
            onChange={(value) => handleChange('tone', value)}
            options={['专业', '轻松', '故事化', '热点']}
          />
          <SelectField
            label="文章长度"
            value={config.contentLength || ''}
            onChange={(value) => handleChange('contentLength', value)}
            options={['短（300字）', '中（800字）', '长（1500字）']}
          />
        </>
      )
    }
    return (
      <>
        <SelectField
          label="视频风格"
          value={config.videoStyle || ''}
          onChange={(value) => handleChange('videoStyle', value)}
          options={['实拍', '动画', '混合']}
        />
        <SelectField
          label="画面比例"
          value={config.videoRatio || ''}
          onChange={(value) => handleChange('videoRatio', value)}
          options={['16:9', '9:16', '1:1']}
        />
        <NumberField
          label="视频时长 (秒)"
          value={config.videoDuration ?? 30}
          min={5}
          max={180}
          onChange={(value) => handleChange('videoDuration', value)}
        />
      </>
    )
  }

  return (
    <div className="cc-config-panel">
      <div className="cc-config-header">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h4>{module.moduleTitle}</h4>
            <span className={`status ${module.status?.toLowerCase()}`}>{module.status}</span>
          </div>
          <span className="timestamp text-xs">{module.lastGeneratedAt ? `最近生成：${dayjs(module.lastGeneratedAt).format('MM-DD HH:mm')}` : '暂未生成'}</span>
        </div>
        <div className="flex items-center gap-3">
          {/* 模板选择 - 右上角 */}
          <div className="flex gap-1.5 items-center">
            <Select value={selectedTemplate || '__none__'} onValueChange={(val) => setSelectedTemplate(val === '__none__' ? '' : val)}>
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue placeholder={templatesLoading ? '加载模板...' : '选择模板'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">不使用模板</SelectItem>
                {templates.map((tpl) => (
                  <SelectItem key={tpl.id} value={String(tpl.id)}>
                    {tpl.templateName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" disabled={!selectedTemplate} onClick={handleApplyTemplate} className="h-8 px-2 text-xs">
              应用
            </Button>
            <Button variant="link" size="sm" onClick={handleSaveTemplate} disabled={creatingTemplate} className="h-8 px-2 text-xs">
              保存
            </Button>
          </div>
        </div>
      </div>

      <div className="cc-config-form">
        <div className="form-field full-row">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label>提示词</label>
            {(promptLoading || promptOptions.length > 0) && (
              <Select value={selectedPromptId || '__manual__'} onValueChange={handlePromptSelect} disabled={promptLoading}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder={promptLoading ? '加载提示词...' : '选择提示词'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__manual__">不使用提示词库</SelectItem>
                  {!promptLoading && promptOptions.length === 0 && (
                    <SelectItem value="__empty__" disabled>
                      暂无提示词
                    </SelectItem>
                  )}
                  {promptOptions.map((prompt) => (
                    <SelectItem key={prompt.id} value={String(prompt.id)}>
                      {prompt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <Textarea
            rows={6}
            value={config.prompt || ''}
            onChange={(e) => {
              setSelectedPromptId('')
              handleChange('prompt', e.target.value)
            }}
            placeholder="描述希望生成的内容、场景、受众等"
          />
        </div>
        {/* 图片比例和主体图一行显示 */}
        <div className="form-field full-row">
          {module.moduleType === 'IMAGE' && (
            <div className="flex gap-12 items-start">
              <div className="flex-1">
                <SelectField
                  label="图片比例"
                  value={config.imageRatio || ''}
                  onChange={(value) => handleChange('imageRatio', value)}
                  options={['1:1', '16:9', '9:16']}
                />
              </div>
              <div className="flex-1">
                <div className="form-field">
                  <label>主体图</label>
                  <SubjectImageSelector
                    images={productImages || []}
                    value={config.subjectImageUrl}
                    onChange={(value) => handleChange('subjectImageUrl', value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {renderModuleSpecificFields()}
        <div className="form-field">
          <label>API厂商</label>
          <Select value={currentVendor} onValueChange={(val) => handleVendorChange(val as ContentApiVendor)}>
            <SelectTrigger>
              <SelectValue placeholder="选择厂商" />
            </SelectTrigger>
            <SelectContent>
              {vendorOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="form-field">
          <label>API名称</label>
          <Select
            value={config.apiName || ''}
            onValueChange={(val) => handleChange('apiName', val)}
          >
            <SelectTrigger disabled={vendorApiEntries.length === 0}>
              <SelectValue placeholder={vendorApiEntries.length ? '选择API' : '暂无可选'} />
            </SelectTrigger>
            <SelectContent>
              {vendorApiEntries.map((opt) => (
                <SelectItem key={opt.providerCode} value={opt.providerCode}>
                  {opt.providerName || opt.providerCode}
                  {opt.modelName ? `（${opt.modelName}）` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="cc-config-footer">
        <div className="flex justify-end">
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? '保存中...' : '保存配置'}
          </Button>
        </div>
      </div>
    </div>
  )
}

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  className?: string
  placeholder?: string
  disabled?: boolean
}

const SelectField: React.FC<SelectFieldProps> = ({ label, value, onChange, options, className, placeholder, disabled }) => (
  <div className={cn('form-field', className)}>
    <label>{label}</label>
    <Select value={value} onValueChange={(val) => onChange(val)}>
      <SelectTrigger disabled={disabled}>
        <SelectValue placeholder={placeholder || `请选择${label}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)

interface NumberFieldProps {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  className?: string
}

const NumberField: React.FC<NumberFieldProps> = ({ label, value, min, max, onChange, className }) => (
  <div className={cn('form-field', className)}>
    <label>{label}</label>
    <Input
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </div>
)

export default ModuleConfigPanel
