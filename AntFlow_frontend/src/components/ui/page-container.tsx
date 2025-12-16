import React from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

/**
 * 通用页面容器组件
 * 提供统一的页面布局：padding、背景色、最小高度
 *
 * 使用方式：
 * <PageContainer>
 *   <PageHeader title="页面标题" />
 *   <Card>...</Card>
 * </PageContainer>
 */
const PageContainer: React.FC<PageContainerProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'min-h-[calc(100vh-120px)] space-y-6 bg-white p-6 pl-[48px]',
        className
      )}
    >
      <div className="[&>*:not(:first-child)]:-ml-6">
        {children}
      </div>
    </div>
  )
}

export default PageContainer
