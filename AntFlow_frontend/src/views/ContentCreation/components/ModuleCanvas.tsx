import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import ConfirmPopover from '@/components/ui/confirm-popover'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import type { ContentModuleItem, ContentModuleType } from '../../../types'
import { Image as ImageIcon, FileText, Video, Sparkles, Trash2, PackageOpen, Loader2, ZoomIn } from 'lucide-react'

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
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const resolveImageSrc = (result: ContentModuleItem['results'][number]) => {
    if (result.assetUrl) {
      return result.assetUrl
    }
    const rawContent = result.content?.trim()
    if (!rawContent) {
      return undefined
    }
    const extractImageCandidate = (text: string) => {
      // 模拟生成结果会把主体图 Base64 放在 “主体图：xxx | 提示词：yyy” 中，先提取其中的图片片段
      const match = text.match(/主体图[:：]\s*([^|]+)/)
      if (match && match[1]) {
        return match[1].trim()
      }
      return text
    }
    const candidate = extractImageCandidate(rawContent)
    if (candidate.startsWith('data:image') || candidate.startsWith('http')) {
      return candidate
    }
    const sanitized = candidate.replace(/\s+/g, '')
    const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/
    if (sanitized.length > 100 && base64Pattern.test(sanitized)) {
      return `data:image/png;base64,${sanitized}`
    }
    return undefined
  }

  const renderResults = (module: ContentModuleItem) => {
    if (!module.results || module.results.length === 0) {
      return <div className="cc-module-empty">等待生成...</div>
    }
    if (module.moduleType === 'IMAGE') {
      return (
        <div className="cc-image-preview">
          {module.results.map((result) => {
            const imageSrc = resolveImageSrc(result)
            return (
              <div key={result.id || result.sortOrder} className={`preview-image${imageSrc ? '' : ' fallback'}`}>
                {imageSrc ? (
                  <div className="image-wrapper">
                    <img src={imageSrc} alt={result.content || 'AI图像'} loading="lazy" />
                    <div className="image-overlay" onClick={() => setPreviewImage(imageSrc)}>
                      <ZoomIn size={20} />
                    </div>
                  </div>
                ) : (
                  <span className="preview-placeholder">预览不可用</span>
                )}
              </div>
            )
          })}
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
              size="sm"
              variant="secondary"
              disabled={generatingIds.includes(module.id)}
              onClick={(e) => {
                e.stopPropagation()
                onGenerateModule(module.id)
              }}
            >
              {generatingIds.includes(module.id) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              <span className="ml-1">生成</span>
            </Button>
            <ConfirmPopover
              title="删除模块"
              description="确认删除该模块？"
              onConfirm={() => onDeleteModule(module.id)}
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <Trash2 size={14} />
              </Button>
            </ConfirmPopover>
          </div>
        </div>
        <div className="cc-module-results">
          {renderResults(module)}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="cc-module-canvas">
        <div className="cc-canvas-header">
          <span>平台：{platformLabel}</span>
        </div>
        <div className="cc-add-module">
          {(['IMAGE', 'ARTICLE', 'VIDEO'] as ContentModuleType[]).map((type) => (
            <Button key={type} variant="outline" onClick={() => onAddModule(type)}>
              {moduleTypeMeta[type].icon}
              <span>{moduleTypeMeta[type].label}</span>
            </Button>
          ))}
        </div>
        <div className="cc-module-list">
          {modules.length === 0 ? (
            <div className="cc-module-empty">
              <PackageOpen className="mb-2 h-6 w-6" />
              <p>请先添加生成模块</p>
            </div>
          ) : (
            modules.map(renderModuleCard)
          )}
        </div>
      </div>

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>图片预览</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="flex justify-center">
              <img
                src={previewImage}
                alt="预览大图"
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ModuleCanvas
