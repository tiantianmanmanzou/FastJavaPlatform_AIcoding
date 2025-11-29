import React, { useEffect, useMemo, useState } from 'react'
import { Input, Select, InputNumber, Button, Space } from '@ui'
import type { ContentModuleItem, ContentTemplateItem, ContentApiVendor } from '../../../types'
import dayjs from 'dayjs'

interface ModuleConfigPanelProps {
  module?: ContentModuleItem | null
  templates: ContentTemplateItem[]
  templatesLoading?: boolean
  onSave: (payload: Partial<ContentModuleItem>) => Promise<void>
  onApplyTemplate: (templateId: number) => Promise<void>
  onSaveTemplate: (templateName: string) => Promise<void>
  saving?: boolean
  creatingTemplate?: boolean
}

const vendorOptions: { label: string; value: ContentApiVendor }[] = [
  { label: '谷歌', value: 'GOOGLE' },
  { label: '豆包', value: 'DOUBAO' },
  { label: 'OpenAI', value: 'OPENAI' }
]

const ModuleConfigPanel: React.FC<ModuleConfigPanelProps> = ({
  module,
  templates,
  templatesLoading,
  onSave,
  onApplyTemplate,
  onSaveTemplate,
  saving,
  creatingTemplate
}) => {
  const [config, setConfig] = useState<Partial<ContentModuleItem>>({})
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  useEffect(() => {
    if (module) {
      setConfig({ ...module })
      setSelectedTemplate('')
    }
  }, [module])

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
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

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
      apiVendor: config.apiVendor
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

  const renderModuleSpecificFields = () => {
    if (module.moduleType === 'IMAGE') {
      return (
        <>
          <SelectField
            label="图片风格"
            value={config.imageStyle || ''}
            onChange={(value) => handleChange('imageStyle', value)}
            options={['写实', '商业', '治愈', '赛博']}
          />
          <SelectField
            label="图片比例"
            value={config.imageRatio || ''}
            onChange={(value) => handleChange('imageRatio', value)}
            options={['1:1', '16:9', '9:16']}
          />
          <div className="form-field">
            <label>图片数量</label>
            <InputNumber
              value={config.imageQuantity ?? 3}
              min={1}
              max={8}
              onChange={(e) => handleChange('imageQuantity', Number((e.target as HTMLInputElement).value))}
            />
          </div>
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
        <div className="form-field">
          <label>视频时长 (秒)</label>
          <InputNumber
            value={config.videoDuration ?? 30}
            min={5}
            max={180}
            onChange={(e) => handleChange('videoDuration', Number((e.target as HTMLInputElement).value))}
          />
        </div>
      </>
    )
  }

  return (
    <div className="cc-config-panel">
      <div className="cc-config-header">
        <div>
          <h4>{module.moduleTitle}</h4>
          <span className={`status ${module.status?.toLowerCase()}`}>{module.status}</span>
        </div>
        <span className="timestamp">{module.lastGeneratedAt ? `最近生成：${dayjs(module.lastGeneratedAt).format('MM-DD HH:mm')}` : '暂未生成'}</span>
      </div>

      <div className="cc-config-actions">
        <Select
          value={selectedTemplate}
          onChange={(val) => setSelectedTemplate((val as string) || '')}
          placeholder={templatesLoading ? '加载模板...' : '选择模板'}
          options={templates.map((tpl) => ({ label: tpl.templateName, value: String(tpl.id) }))}
          allowClear
        />
        <Space>
          <Button type="default" disabled={!selectedTemplate} onClick={handleApplyTemplate}>
            应用模板
          </Button>
          <Button type="link" onClick={handleSaveTemplate} loading={creatingTemplate}>
            保存为模板
          </Button>
        </Space>
      </div>

      <div className="cc-config-form">
        <div className="form-field">
          <label>模块名称</label>
          <Input value={config.moduleTitle} onChange={(e) => handleChange('moduleTitle', e.target.value)} maxLength={60} />
        </div>
        <div className="form-field">
          <label>提示词</label>
          <Input.TextArea
            rows={3}
            value={config.prompt || ''}
            onChange={(e) => handleChange('prompt', e.target.value)}
            placeholder="描述希望生成的内容、场景、受众等"
          />
        </div>
        <SelectField
          label="内容风格"
          value={config.style || ''}
          onChange={(value) => handleChange('style', value)}
          options={['商业', '情感', '科技', '生活方式']}
        />
        {renderModuleSpecificFields()}
        <div className="form-field">
          <label>API厂商</label>
          <Select
            value={config.apiVendor || 'GOOGLE'}
            onChange={(val) => handleChange('apiVendor', val as ContentApiVendor)}
            options={vendorOptions}
          />
        </div>
      </div>

      <div className="cc-config-footer">
        <Button type="primary" onClick={handleSave} loading={saving} block>
          保存配置
        </Button>
      </div>
    </div>
  )
}

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}

const SelectField: React.FC<SelectFieldProps> = ({ label, value, onChange, options }) => (
  <div className="form-field">
    <label>{label}</label>
    <Select
      value={value}
      onChange={(val) => onChange(val as string)}
      placeholder={`请选择${label}`}
      allowClear
      options={options.map((item) => ({ label: item, value: item }))}
    />
  </div>
)

export default ModuleConfigPanel
