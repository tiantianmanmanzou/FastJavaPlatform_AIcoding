import React from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: React.ReactNode
  description?: React.ReactNode
  extra?: React.ReactNode
  className?: string
  descriptionClassName?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  extra,
  className,
  descriptionClassName
}) => {
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-4', className)}>
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        {description ? (
          <p className={cn('text-sm text-slate-500', descriptionClassName)}>{description}</p>
        ) : null}
      </div>
      {extra ? <div className="flex shrink-0 items-center gap-3">{extra}</div> : null}
    </div>
  )
}

export default PageHeader
