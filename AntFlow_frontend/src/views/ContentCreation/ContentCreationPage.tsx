import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { message } from '@/lib/message'
import { Button } from '@/components/ui/button'
import ResizablePanel from '@/components/ui/resizable-panel'
import { Loader2 } from 'lucide-react'
import { fetchSimpleProducts } from '../../api/product'
import {
  fetchContentModules,
  createContentModule,
  updateContentModule,
  deleteContentModule,
  generateContentModule,
  fetchContentTemplates,
  createContentTemplate
} from '../../api/content'
import type {
  ProductSimpleItem,
  ContentModuleItem,
  ContentModuleType,
  ContentPlatform,
  ContentTemplateItem
} from '../../types'
import ProductListPanel from './components/ProductListPanel'
import ModuleCanvas from './components/ModuleCanvas'
import ModuleConfigPanel from './components/ModuleConfigPanel'
import './ContentCreationPage.scss'

const platformTabs: { label: string; value: ContentPlatform }[] = [
  { label: '小红书', value: 'XIAOHONGSHU' },
  { label: '公众号', value: 'WECHAT' },
  { label: '抖音短视频', value: 'DOUYIN' }
]

const moduleTypeLabel: Record<ContentModuleType, string> = {
  IMAGE: '图片生成模块',
  ARTICLE: '文章生成模块',
  VIDEO: '视频生成模块'
}

const STORAGE_KEY_LEFT = 'contentCreationPageLeftWidth'
const STORAGE_KEY_RIGHT = 'contentCreationPageRightWidth'
const DEFAULT_LEFT_WIDTH = 260
const DEFAULT_RIGHT_WIDTH = 340

const ContentCreationPage: React.FC = () => {
  // 从localStorage读取保存的宽度，如果没有则使用默认值
  const [leftWidth, setLeftWidth] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LEFT)
    return saved ? parseInt(saved, 10) : DEFAULT_LEFT_WIDTH
  })
  const [rightWidth, setRightWidth] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_RIGHT)
    return saved ? parseInt(saved, 10) : DEFAULT_RIGHT_WIDTH
  })

  const [products, setProducts] = useState<ProductSimpleItem[]>([])
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [platform, setPlatform] = useState<ContentPlatform>('XIAOHONGSHU')
  const [modules, setModules] = useState<ContentModuleItem[]>([])
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null)
  const [moduleDrafts, setModuleDrafts] = useState<Record<number, Partial<ContentModuleItem>>>({})
  const [templates, setTemplates] = useState<ContentTemplateItem[]>([])
  const [loadingModules, setLoadingModules] = useState(false)
  const [savingConfig, setSavingConfig] = useState(false)
  const [templateLoading, setTemplateLoading] = useState(false)
  const [creatingTemplate, setCreatingTemplate] = useState(false)
  const [generatingIds, setGeneratingIds] = useState<number[]>([])
  const selectedProduct = useMemo(
    () => products.find((item) => item.id === selectedProductId) || null,
    [products, selectedProductId]
  )

  const loadProducts = useCallback(async () => {
    try {
      const res = await fetchSimpleProducts()
      const list = res.data || []
      setProducts(list)
      if (!selectedProductId && list.length > 0) {
        setSelectedProductId(list[0].id)
      }
    } catch (error) {
      console.error(error)
    }
  }, [selectedProductId])

  const loadModules = useCallback(async (productId: number, currentPlatform: ContentPlatform) => {
    setLoadingModules(true)
    try {
      const res = await fetchContentModules({ productId, platform: currentPlatform })
      const moduleList = res.data || []
      setModules(moduleList)
      if (moduleList.length > 0) {
        const exists = moduleList.some((item) => item.id === selectedModuleId)
        setSelectedModuleId(exists ? selectedModuleId : moduleList[0].id)
      } else {
        setSelectedModuleId(null)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingModules(false)
    }
  }, [selectedModuleId])

  const loadTemplates = useCallback(async (currentPlatform: ContentPlatform, type?: ContentModuleType) => {
    if (!type) {
      setTemplates([])
      return
    }
    setTemplateLoading(true)
    try {
      const res = await fetchContentTemplates({ platform: currentPlatform, moduleType: type })
      setTemplates(res.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setTemplateLoading(false)
    }
  }, [])

  // 保存左侧栏宽度到localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LEFT, String(leftWidth))
  }, [leftWidth])

  // 保存右侧栏宽度到localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RIGHT, String(rightWidth))
  }, [rightWidth])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    if (selectedProductId) {
      loadModules(selectedProductId, platform)
    }
  }, [selectedProductId, platform, loadModules])

  const selectedModule = useMemo(() => modules.find((item) => item.id === selectedModuleId), [modules, selectedModuleId])

  useEffect(() => {
    if (selectedModule) {
      loadTemplates(platform, selectedModule.moduleType)
    } else {
      setTemplates([])
    }
  }, [platform, selectedModule, loadTemplates])

  const handleAddModule = async (type: ContentModuleType) => {
    if (!selectedProductId) {
      message.error('请先选择产品')
      return
    }
    const count = modules.filter((item) => item.moduleType === type).length + 1
    const defaultSubjectImage =
      type === 'IMAGE'
        ? selectedProduct?.mainImageUrl || (selectedProduct?.imageUrls && selectedProduct.imageUrls[0]) || undefined
        : undefined
    try {
      await createContentModule({
        productId: selectedProductId,
        platform,
        moduleType: type,
        moduleTitle: `${moduleTypeLabel[type]} #${count}`,
        subjectImageUrl: defaultSubjectImage
      })
      message.success('已添加模块')
      loadModules(selectedProductId, platform)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDraftChange = (moduleId: number, draft: Partial<ContentModuleItem>) => {
    setModuleDrafts((prev) => ({ ...prev, [moduleId]: draft }))
  }

  const handleSaveConfig = async (payload: Partial<ContentModuleItem>) => {
    if (!selectedModule) return false
    setSavingConfig(true)
    try {
      const res = await updateContentModule(selectedModule.id, {
        moduleTitle: payload.moduleTitle || selectedModule.moduleTitle,
        prompt: payload.prompt,
        tone: payload.tone,
        style: payload.style,
        contentLength: payload.contentLength,
        imageStyle: payload.imageStyle,
        imageRatio: payload.imageRatio,
        imageQuantity: payload.imageQuantity,
        videoStyle: payload.videoStyle,
        videoRatio: payload.videoRatio,
        videoDuration: payload.videoDuration,
        subjectImageUrl: payload.subjectImageUrl,
        apiVendor: payload.apiVendor,
        apiName: payload.apiName
      })
      message.success('配置已保存')
      setModules((prev) => prev.map((item) => (item.id === res.data.id ? res.data : item)))
      setModuleDrafts((prev) => ({ ...prev, [res.data.id]: res.data }))
      return true
    } catch (error) {
      console.error(error)
      message.error('配置保存失败，请稍后重试')
      return false
    } finally {
      setSavingConfig(false)
    }
  }

  const handleApplyTemplate = async (templateId: number) => {
    if (!selectedModule) return
    try {
      const res = await updateContentModule(selectedModule.id, { moduleTitle: selectedModule.moduleTitle, templateId })
      message.success('模板已应用')
      setModules((prev) => prev.map((item) => (item.id === res.data.id ? res.data : item)))
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreateTemplate = async (templateName: string) => {
    if (!selectedModule) return
    setCreatingTemplate(true)
    try {
      await createContentTemplate({
        templateName,
        platform,
        moduleType: selectedModule.moduleType,
        description: selectedModule.prompt?.slice(0, 60),
        prompt: selectedModule.prompt,
        tone: selectedModule.tone,
        style: selectedModule.style,
        contentLength: selectedModule.contentLength,
        imageStyle: selectedModule.imageStyle,
        imageRatio: selectedModule.imageRatio,
        imageQuantity: selectedModule.imageQuantity,
        videoStyle: selectedModule.videoStyle,
        videoRatio: selectedModule.videoRatio,
        videoDuration: selectedModule.videoDuration,
        apiVendor: selectedModule.apiVendor,
        apiName: selectedModule.apiName
      })
      message.success('模板已保存')
      loadTemplates(platform, selectedModule.moduleType)
    } catch (error) {
      console.error(error)
    } finally {
      setCreatingTemplate(false)
    }
  }

  const handleDeleteModule = async (id: number) => {
    try {
      await deleteContentModule(id)
      message.success('模块已删除')
      setModuleDrafts((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      if (selectedProductId) {
        loadModules(selectedProductId, platform)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleGenerateModule = async (id: number) => {
    if (id === selectedModule?.id && moduleDrafts[id]) {
      const saved = await handleSaveConfig(moduleDrafts[id])
      if (!saved) {
        return
      }
    }
    setGeneratingIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    try {
      const res = await generateContentModule(id)
      message.success('生成完成')
      setModules((prev) => prev.map((item) => (item.id === res.data.id ? res.data : item)))
    } catch (error) {
      console.error(error)
    } finally {
      setGeneratingIds((prev) => prev.filter((item) => item !== id))
    }
  }

  const handleApplyTemplateToModule = async (templateId: number) => {
    await handleApplyTemplate(templateId)
  }

  const handleSaveTemplate = async (templateName: string) => {
    await handleCreateTemplate(templateName)
  }

  const handleConfigSave = async (payload: Partial<ContentModuleItem>) => {
    await handleSaveConfig(payload)
  }

  return (
    <div className="content-creation-page" style={{ gridTemplateColumns: `${leftWidth}px 1fr ${rightWidth}px` }}>
      <ResizablePanel
        width={leftWidth}
        minWidth={200}
        maxWidth={window.innerWidth * 0.4}
        onWidthChange={setLeftWidth}
        className="column left"
      >
        <ProductListPanel
          products={products}
          selectedId={selectedProductId}
          onSelect={(id) => setSelectedProductId(id)}
        />
      </ResizablePanel>
      <div className="column center">
        <div className="platform-switcher">
          {platformTabs.map((tab) => (
            <Button
              key={tab.value}
              variant={tab.value === platform ? 'default' : 'secondary'}
              className={tab.value === platform ? 'active' : ''}
              onClick={() => setPlatform(tab.value)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        {loadingModules ? (
          <div className="canvas-loading">
            <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
          </div>
        ) : (
          <ModuleCanvas
            modules={modules}
            platformLabel={platformTabs.find((tab) => tab.value === platform)?.label || ''}
            selectedModuleId={selectedModuleId}
            onSelectModule={(id) => setSelectedModuleId(id)}
            onAddModule={handleAddModule}
            onDeleteModule={handleDeleteModule}
            onGenerateModule={handleGenerateModule}
            generatingIds={generatingIds}
          />
        )}
      </div>
      <ResizablePanel
        width={rightWidth}
        minWidth={280}
        maxWidth={window.innerWidth * 0.7}
        onWidthChange={setRightWidth}
        className="column right"
        position="right"
      >
        <ModuleConfigPanel
          module={selectedModule}
          templates={templates}
          templatesLoading={templateLoading}
          onSave={handleConfigSave}
          onApplyTemplate={handleApplyTemplateToModule}
          onSaveTemplate={handleSaveTemplate}
          onConfigChange={handleDraftChange}
          saving={savingConfig}
          creatingTemplate={creatingTemplate}
          productImages={selectedProduct?.imageUrls || []}
          defaultSubjectImage={selectedProduct?.mainImageUrl || selectedProduct?.imageUrls?.[0]}
        />
      </ResizablePanel>
    </div>
  )
}

export default ContentCreationPage
