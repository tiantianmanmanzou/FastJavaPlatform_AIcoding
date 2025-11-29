import React from 'react'
import { Button, Empty } from '@ui'
import type { ContentModuleItem, ContentModuleType } from '../../../types'
import { Image as ImageIcon, FileText, Video, Sparkles, Trash2 } from 'lucide-react'

interface ModuleCanvasProps {
  modules: ContentModuleItem[]
  platformLabel: string
  selectedModuleId?: number | null
  onSelectModule: (id: number) => void
  onAddModule: (type: ContentModuleType) => void
  onDeleteModule: (id: number) => void
  onGenerateModule: (id: number) => void
  generatingIds: number[]
}

const moduleTypeMeta: Record<ContentModuleType, { label: string; icon: React.ReactNode }> = {
  IMAGE: { label: '图片生成', icon: <ImageIcon size={16} /> },
  ARTICLE: { label: '文章生成', icon: <FileText size={16} /> },
  VIDEO: { label: '视频生成', icon: <Video size={16} /> }
}

const ModuleCanvas: React.FC<ModuleCanvasProps> = ({
  modules,
  platformLabel,
  selectedModuleId,
  onSelectModule,
  onAddModule,
  onDeleteModule,
  onGenerateModule,
  generatingIds
}) => {
  const renderResults = (module: ContentModuleItem) => {
    if (!module.results || module.results.length === 0) {
      return <div className="cc-module-empty">等待生成...</div>
    }
    if (module.moduleType === 'IMAGE') {
      return (
        <div className="cc-image-preview">
          {module.results.map((result) => (
            <div key={result.id || result.sortOrder} className="preview-image">
              <img src={result.assetUrl || ''} alt={result.content || 'AI图像'} />
            </div>
          ))}
        </div>
      )
    }
    if (module.moduleType === 'ARTICLE') {
      return (
        <div className="cc-text-preview">
          <pre>{module.results[0]?.content}</pre>
        </div>
      )
    }
    return (
      <div className="cc-video-preview">
        <div className="video-placeholder">{module.results[0]?.content || '视频脚本预览'}</div>
      </div>
    )
  }

  const renderModuleCard = (module: ContentModuleItem) => {
    const meta = moduleTypeMeta[module.moduleType]
    return (
      <div
        key={module.id}
        className={`cc-module-card ${selectedModuleId === module.id ? 'selected' : ''}`}
        onClick={() => onSelectModule(module.id)}
      >
        <div className="cc-module-header">
          <div className="title">
            {meta?.icon}
            <span>{module.moduleTitle}</span>
          </div>
          <div className="actions">
            <Button
              size="small"
              type="default"
              loading={generatingIds.includes(module.id)}
              onClick={(e) => {
                e.stopPropagation()
                onGenerateModule(module.id)
              }}
            >
              <Sparkles size={14} />
              <span>生成</span>
            </Button>
            <Button
              size="small"
              type="link"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteModule(module.id)
              }}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
        <div className="cc-module-results">
          {renderResults(module)}
        </div>
      </div>
    )
  }

  return (
    <div className="cc-module-canvas">
      <div className="cc-canvas-header">
        <span>平台：{platformLabel}</span>
      </div>
      <div className="cc-add-module">
        {(['IMAGE', 'ARTICLE', 'VIDEO'] as ContentModuleType[]).map((type) => (
          <Button key={type} type="default" onClick={() => onAddModule(type)}>
            {moduleTypeMeta[type].icon}
            <span>{moduleTypeMeta[type].label}</span>
          </Button>
        ))}
      </div>
      <div className="cc-module-list">
        {modules.length === 0 ? (
          <div className="cc-module-empty">
            <Empty description="请先添加生成模块" />
          </div>
        ) : (
          modules.map(renderModuleCard)
        )}
      </div>
    </div>
  )
}

export default ModuleCanvas
