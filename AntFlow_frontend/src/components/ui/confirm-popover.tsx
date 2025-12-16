import React, { useEffect, useRef, useState } from 'react'
import { Button } from './button'
import { cn } from '../../lib/utils'

interface ConfirmPopoverProps {
  children: React.ReactElement
  title?: string
  description?: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  disabled?: boolean
  placement?: 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
  tone?: 'default' | 'danger'
}

const ConfirmPopover: React.FC<ConfirmPopoverProps> = ({
  children,
  title = '确认操作',
  description = '请确认执行该操作',
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  disabled = false,
  placement = 'top',
  align = 'end',
  tone = 'danger'
}) => {
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleTriggerClick = (event: React.MouseEvent) => {
    if (disabled) return
    event.stopPropagation()
    setOpen((prev) => !prev)
  }

  const clonedChild = React.isValidElement(children)
    ? React.cloneElement(children, {
        onClick: (event: React.MouseEvent) => {
          children.props.onClick?.(event)
          if (event.defaultPrevented) return
          handleTriggerClick(event)
        }
      })
    : children

  const handleConfirm = async () => {
    if (confirming) return
    setConfirming(true)
    try {
      await Promise.resolve(onConfirm())
    } finally {
      setConfirming(false)
      setOpen(false)
    }
  }

  const placementClass = cn(
    'absolute z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-xl',
    placement === 'top' ? 'bottom-full mb-2' : 'top-full',
    align === 'start' ? 'left-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'right-0'
  )

  return (
    <div ref={containerRef} className="relative inline-flex">
      {clonedChild}
      {open && (
        <div className={placementClass} onClick={(event) => event.stopPropagation()}>
          {title && <div className="text-sm font-semibold text-slate-900">{title}</div>}
          {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
          <div className="mt-3 flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)} disabled={confirming}>
              {cancelText}
            </Button>
            <Button
              size="sm"
              className={cn(tone === 'danger' ? 'bg-rose-500 text-white hover:bg-rose-500/90' : undefined)}
              onClick={handleConfirm}
              disabled={confirming}
            >
              {confirming ? '处理中...' : confirmText}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConfirmPopover
