import React, { useEffect, useRef, useState } from 'react'

export interface ResizablePanelProps {
  width: number
  minWidth?: number
  maxWidth?: number
  onWidthChange: (width: number) => void
  children: React.ReactNode
  className?: string
  position?: 'left' | 'right'
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  width,
  minWidth = 200,
  maxWidth = 600,
  onWidthChange,
  children,
  className,
  position = 'left'
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = useState(false)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const delta = e.clientX - startXRef.current
      let newWidth: number

      if (position === 'right') {
        // 对于右侧面板，向左拖拽减少宽度，向右增加宽度
        newWidth = startWidthRef.current - delta
      } else {
        // 对于左侧面板，向右拖拽增加宽度，向左减少宽度
        newWidth = startWidthRef.current + delta
      }

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        onWidthChange(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = 'auto'
      document.body.style.userSelect = 'auto'
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, minWidth, maxWidth, onWidthChange, position])

  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX
    startWidthRef.current = width
    setIsResizing(true)
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: `${width}px`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {children}
      <div
        onMouseDown={handleMouseDown}
        className="resizable-divider"
        style={{
          position: 'absolute',
          [position === 'right' ? 'left' : 'right']: -8,
          top: 0,
          bottom: 0,
          width: 16,
          cursor: 'col-resize',
          zIndex: 10
        }}
      />
    </div>
  )
}

export default ResizablePanel
