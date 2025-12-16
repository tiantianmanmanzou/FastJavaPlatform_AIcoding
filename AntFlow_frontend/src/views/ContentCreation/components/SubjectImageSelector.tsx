import React, { useMemo } from 'react'
import { Check } from 'lucide-react'

interface SubjectImageSelectorProps {
  images?: string[]
  value?: string
  onChange: (value?: string) => void
}

const SubjectImageSelector: React.FC<SubjectImageSelectorProps> = ({ images = [], value, onChange }) => {
  const resolvedImages = useMemo(() => {
    const cleaned = images.filter((item): item is string => Boolean(item))
    if (value && !cleaned.includes(value)) {
      return [value, ...cleaned]
    }
    return cleaned
  }, [images, value])

  if (!resolvedImages || resolvedImages.length === 0) {
    return (
      <div className="subject-image-empty text-sm text-slate-400">
        暂无产品图片，请先在产品管理中上传
      </div>
    )
  }

  return (
    <div className="subject-image-selector">
      {resolvedImages.map((url, index) => {
        const active = value === url
        return (
          <button
            type="button"
            key={`${url}-${index}`}
            className={`subject-thumb ${active ? 'active' : ''}`}
            onClick={() => onChange(active ? undefined : url)}
            title={url}
          >
            <img src={url} alt="产品图片" />
            <div className="subject-thumb-mask">
              <Check size={16} />
              <span>已选</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default SubjectImageSelector
