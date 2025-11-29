import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, message, Spin } from '@ui'
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

const ContentCreationPage: React.FC = () => {
  const [products, setProducts] = useState<ProductSimpleItem[]>([])
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [platform, setPlatform] = useState<ContentPlatform>('XIAOHONGSHU')
  const [modules, setModules] = useState<ContentModuleItem[]>([])
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null)
  const [templates, setTemplates] = useState<ContentTemplateItem[]>([])
  const [loadingModules, setLoadingModules] = useState(false)
  const [savingConfig, setSavingConfig] = useState(false)
  const [templateLoading, setTemplateLoading] = useState(false)
  const [creatingTemplate, setCreatingTemplate] = useState(false)
  const [generatingIds, setGeneratingIds] = useState<number[]>([])

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
    try {
      await createContentModule({
        productId: selectedProductId,
        platform,
        moduleType: type,
        moduleTitle: `${moduleTypeLabel[type]} #${count}`
      })
      message.success('已添加模块')
      loadModules(selectedProductId, platform)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSaveConfig = async (payload: Partial<ContentModuleItem>) => {
    if (!selectedModule) return
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
        apiVendor: payload.apiVendor
      })
      message.success('配置已保存')
      setModules((prev) => prev.map((item) => (item.id === res.data.id ? res.data : item)))
    } catch (error) {
      console.error(error)
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
        apiVendor: selectedModule.apiVendor
      })
      message.success('模板已保存')
      loadTemplates(platform, selectedModule.moduleType)
    } catch (error) {
      console.error(error)
    } finally {
      setCreatingTemplate(false)
    }
  }

  const handleDeleteModule = (id: number) => {
    const confirmed = window.confirm('确认删除该模块？')
    if (!confirmed) return
    deleteContentModule(id)
      .then(() => {
        message.success('模块已删除')
        if (selectedProductId) {
          loadModules(selectedProductId, platform)
        }
      })
      .catch((error) => console.error(error))
  }

  const handleGenerateModule = async (id: number) => {
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
    <div className="content-creation-page">
      <div className="column left">
        <ProductListPanel
          products={products}
          selectedId={selectedProductId}
          onSelect={(id) => setSelectedProductId(id)}
          extraAction={<Button type="link" onClick={() => (window.location.hash = '#/product-management')}>产品管理</Button>}
        />
      </div>
      <div className="column center">
        <div className="platform-switcher">
          {platformTabs.map((tab) => (
            <button
              key={tab.value}
              className={tab.value === platform ? 'active' : ''}
              onClick={() => setPlatform(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {loadingModules ? (
          <div className="canvas-loading">
            <Spin />
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
      <div className="column right">
        <ModuleConfigPanel
          module={selectedModule}
          templates={templates}
          templatesLoading={templateLoading}
          onSave={handleConfigSave}
          onApplyTemplate={handleApplyTemplateToModule}
          onSaveTemplate={handleSaveTemplate}
          saving={savingConfig}
          creatingTemplate={creatingTemplate}
        />
      </div>
    </div>
  )
}

export default ContentCreationPage
