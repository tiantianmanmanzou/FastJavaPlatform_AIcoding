import React from 'react'
import { cn } from '@/lib/utils'

type SpinnerSize = 'sm' | 'md' | 'lg'

const sizeMap: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]'
}

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className, ...rest }) => {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn('inline-flex items-center justify-center', className)}
      {...rest}
    >
      <span
        className={cn(
          'animate-spin rounded-full border-slate-200 border-t-slate-600',
          sizeMap[size]
        )}
      />
    </span>
  )
}

