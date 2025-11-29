import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import dayjs, { type Dayjs } from 'dayjs'
import { toast, Toaster } from 'sonner'
import { cn } from '../lib/utils'
import { Button as ShadButton } from '../components/ui/button'
import { Input as ShadInput } from '../components/ui/input'
import { Textarea as ShadTextarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Card as ShadCard, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Label } from '../components/ui/label'
import './styles.css'

// ---------------------- message ----------------------
export const message = {
  success: (content: string) => toast.success(content),
  error: (content: string) => toast.error(content),
  warning: (content: string) => toast.warning(content),
  info: (content: string) => toast.info(content),
  loading: (content: string) => toast.loading(content)
}

// ---------------------- ConfigProvider ----------------------
interface ConfigProviderProps {
  children: React.ReactNode
  locale?: any
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      {children}
    </>
  )
}

// ---------------------- Button ----------------------
interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type?: 'default' | 'primary' | 'link'
  htmlType?: 'button' | 'submit' | 'reset'
  loading?: boolean
  size?: 'small' | 'middle' | 'large'
  block?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type: styleType = 'default',
      htmlType = 'button',
      loading = false,
      size = 'middle',
      block = false,
      children,
      className,
      disabled,
      ...rest
    },
    ref
  ) => {
    const variant = styleType === 'primary' ? 'default' : styleType === 'link' ? 'link' : 'outline'
    const sizeVariant = size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'default'
    return (
      <ShadButton
        ref={ref}
        type={htmlType}
        variant={variant as any}
        size={sizeVariant as any}
        className={cn(block ? 'w-full' : '', className)}
        disabled={disabled || loading}
        {...rest}
      >
        {loading && <span className="antd-spin-icon" style={{ width: 16, height: 16, borderWidth: 2 }} />}
        {children}
      </ShadButton>
    )
  }
)
Button.displayName = 'Button'

// ---------------------- Input ----------------------
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  allowClear?: boolean
  showCount?: boolean
  prefix?: React.ReactNode
}

const BaseInput = React.forwardRef<HTMLInputElement, InputProps>(({ allowClear, showCount, prefix, className, style, value, onChange, ...rest }, ref) => {
  const [internal, setInternal] = useState<string>(String(value ?? ''))

  useEffect(() => {
    setInternal(String(value ?? ''))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternal(e.target.value)
    onChange?.(e)
  }

  const handleClear = () => {
    setInternal('')
    const event = { target: { value: '' } } as any
    onChange?.(event)
  }

  const paddingLeft = prefix ? 34 : undefined

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {prefix && (
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
          {prefix}
        </span>
      )}
      <ShadInput
        ref={ref}
        className={className}
        style={{ ...style, paddingLeft }}
        value={internal}
        onChange={handleChange}
        {...rest}
      />
      {allowClear && internal && (
        <button
          type="button"
          aria-label="clear"
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      )}
      {showCount && typeof rest.maxLength === 'number' && (
        <div style={{
          position: 'absolute',
          right: 4,
          bottom: -20,
          fontSize: 12,
          color: '#94a3b8'
        }}>
          {internal.length}/{rest.maxLength}
        </div>
      )}
    </div>
  )
})
BaseInput.displayName = 'Input'

const TextArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { showCount?: boolean }>(
  ({ className, showCount, value, onChange, ...rest }, ref) => {
    const [internal, setInternal] = useState<string>(String(value ?? ''))

    useEffect(() => {
      setInternal(String(value ?? ''))
    }, [value])

    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <ShadTextarea
          ref={ref}
          className={className}
          value={internal}
          onChange={(e) => {
            setInternal(e.target.value)
            onChange?.(e)
          }}
          {...rest}
        />
        {showCount && typeof rest.maxLength === 'number' && (
          <div style={{ position: 'absolute', right: 4, bottom: -20, fontSize: 12, color: '#94a3b8' }}>
            {internal.length}/{rest.maxLength}
          </div>
        )}
      </div>
    )
  }
)
TextArea.displayName = 'TextArea'

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <BaseInput ref={ref} type="password" {...props} />
))
PasswordInput.displayName = 'Password'

export const Input = Object.assign(BaseInput, { TextArea, Password: PasswordInput })

// ---------------------- Select ----------------------
export interface OptionType {
  label: React.ReactNode
  value: any
}

interface SelectProps {
  value?: any
  defaultValue?: any
  onChange?: (value: any) => void
  options?: OptionType[]
  placeholder?: string
  mode?: 'multiple'
  allowClear?: boolean
  showSearch?: boolean
  filterOption?: (input: string, option?: OptionType) => boolean
  children?: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

const Option: React.FC<OptionType & { children?: React.ReactNode }> = ({ children }) => <>{children}</>

export const Select: React.FC<SelectProps> & { Option: typeof Option } = ({
  value,
  defaultValue,
  onChange,
  options,
  placeholder,
  mode,
  allowClear,
  showSearch,
  filterOption,
  children,
  style,
  className
}) => {
  const isMultiple = mode === 'multiple'
  const [search, setSearch] = useState('')
  const resolvedOptions: OptionType[] = useMemo(() => {
    if (options && options.length) return options
    const opts: OptionType[] = []
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return
      const props: any = child.props
      if (props?.value !== undefined) {
        opts.push({ value: props.value, label: props.label ?? child.props.children })
      }
    })
    return opts
  }, [children, options])

  const filtered = useMemo(() => {
    if (!showSearch || !filterOption || !search) return resolvedOptions
    return resolvedOptions.filter((opt) => filterOption(search, opt))
  }, [resolvedOptions, showSearch, filterOption, search])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isMultiple) {
      const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value)
      onChange?.(selected)
    } else {
      onChange?.(e.target.value)
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {showSearch && (
        <input
          className="antd-input"
          style={{ marginBottom: 8 }}
          placeholder="搜索"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}
      <select
        multiple={isMultiple}
        className={cn('antd-select', className)}
        style={style}
        value={value ?? (isMultiple ? [] : '')}
        defaultValue={defaultValue}
        onChange={handleChange}
      >
        {placeholder && !isMultiple && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {filtered.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label as any}
          </option>
        ))}
      </select>
      {allowClear && value && !isMultiple && (
        <button
          type="button"
          onClick={() => onChange?.(undefined)}
          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          ×
        </button>
      )}
    </div>
  )
}
Select.Option = Option

// ---------------------- DatePicker ----------------------
export interface DatePickerProps {
  value?: Dayjs | null
  onChange?: (value: Dayjs | null, dateString?: string) => void
  placeholder?: string
  style?: React.CSSProperties
  format?: string
  allowClear?: boolean
  disabledDate?: (current: Dayjs) => boolean
}

const DatePickerBase: React.FC<DatePickerProps> = ({ value, onChange, placeholder, style, format = 'YYYY-MM-DD', allowClear = true, disabledDate }) => {
  const stringValue = value ? dayjs(value).format('YYYY-MM-DD') : ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (!val) {
      onChange?.(null, '')
      return
    }
    const next = dayjs(val)
    if (disabledDate && disabledDate(next)) {
      return
    }
    onChange?.(next, val)
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="date"
        className="antd-date"
        style={style}
        placeholder={placeholder}
        value={stringValue}
        onChange={handleChange}
      />
      {allowClear && stringValue && (
        <button
          type="button"
          onClick={() => onChange?.(null, '')}
          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          ×
        </button>
      )}
      {format && (
        <input type="hidden" value={format} readOnly />
      )}
    </div>
  )
}

interface RangePickerProps {
  value?: [Dayjs | null, Dayjs | null]
  onChange?: (value: [Dayjs | null, Dayjs | null], dateStrings?: [string, string]) => void
  placeholder?: [string, string]
  format?: string
  allowClear?: boolean
}

const RangePicker: React.FC<RangePickerProps> = ({ value = [null, null], onChange, placeholder, allowClear = true }) => {
  const [start, end] = value
  const startString = start ? dayjs(start).format('YYYY-MM-DD') : ''
  const endString = end ? dayjs(end).format('YYYY-MM-DD') : ''

  return (
    <div style={{ display: 'flex', gap: 8, width: '100%' }}>
      <input
        type="date"
        className="antd-date"
        value={startString}
        placeholder={placeholder?.[0]}
        onChange={(e) => {
          const next = dayjs(e.target.value || undefined)
          onChange?.([e.target.value ? next : null, end], [e.target.value, endString])
        }}
      />
      <input
        type="date"
        className="antd-date"
        value={endString}
        placeholder={placeholder?.[1]}
        onChange={(e) => {
          const next = dayjs(e.target.value || undefined)
          onChange?.([start, e.target.value ? next : null], [startString, e.target.value])
        }}
      />
      {allowClear && (start || end) && (
        <button
          type="button"
          onClick={() => onChange?.([null, null], ['', ''])}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          清空
        </button>
      )}
    </div>
  )
}

export const DatePicker = Object.assign(DatePickerBase, { RangePicker })

// ---------------------- Form ----------------------
interface FieldRule {
  required?: boolean
  message?: string
  max?: number
  min?: number
  validator?: (rule: FieldRule, value: any) => Promise<void> | void
}

interface FormItemProps {
  label?: React.ReactNode
  name?: string
  rules?: FieldRule[]
  required?: boolean
  children: React.ReactNode
  valuePropName?: string
  className?: string
  tooltip?: string
}

interface FormContextType {
  register: (name: string, rules?: FieldRule[]) => void
  unregister: (name: string) => void
  setValue: (name: string, value: any) => void
  getValue: (name: string) => any
  getError: (name: string) => string | null
  clearError: (name: string) => void
}

interface FormInstance {
  getFieldsValue: () => Record<string, any>
  getFieldValue: (name: string) => any
  getFieldError: (name: string) => string | null
  clearFieldError: (name: string) => void
  setFieldsValue: (values: Record<string, any>) => void
  resetFields: () => void
  validateFields: () => Promise<Record<string, any>>
  __register?: (name: string, rules?: FieldRule[]) => void
  __unregister?: (name: string) => void
}

const FormContext = createContext<FormContextType | null>(null)

const useFormInternal = (initialValues?: Record<string, any>): FormInstance => {
  const [values, setValues] = useState<Record<string, any>>(initialValues || {})
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const rulesRef = useRef<Record<string, FieldRule[] | undefined>>({})
  const formRef = useRef<FormInstance | null>(null)

  const setFieldError = useCallback((name: string, error: string | null) => {
    setErrors((prev) => {
      const next = { ...prev }
      if (error) {
        next[name] = error
      } else {
        delete next[name]
      }
      return next
    })
  }, [])

  const getFieldsValue = useCallback(() => ({ ...values }), [values])
  const getFieldValue = useCallback((name: string) => values[name], [values])
  const getFieldError = useCallback((name: string) => errors[name] ?? null, [errors])
  const clearFieldError = useCallback((name: string) => setFieldError(name, null), [setFieldError])
  const setFieldsValue = useCallback((vals: Record<string, any>) => {
    setValues((prev) => ({ ...prev, ...vals }))
  }, [])
  const resetFields = useCallback(() => {
    setValues(initialValues || {})
    setErrors({})
  }, [initialValues])
  const validateFields = useCallback(async () => {
    const nextErrors: Record<string, string> = {}
    for (const [name, rules] of Object.entries(rulesRef.current)) {
      const value = values[name]
      if (rules) {
        for (const rule of rules) {
          if (rule.required && (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0))) {
            nextErrors[name] = rule.message || `${name} 为必填项`
            break
          }
          if (typeof rule.min === 'number' && typeof value === 'string' && value.length < rule.min) {
            nextErrors[name] = rule.message || `${name} 长度需大于 ${rule.min}`
            break
          }
          if (typeof rule.max === 'number' && typeof value === 'string' && value.length > rule.max) {
            nextErrors[name] = rule.message || `${name} 长度需小于 ${rule.max}`
            break
          }
          if (rule.validator) {
            await rule.validator(rule, value)
          }
        }
      }
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      throw new Error('Validation failed')
    }
    return { ...values }
  }, [values])
  const register = useCallback((name: string, rules?: FieldRule[]) => {
    rulesRef.current[name] = rules
  }, [])
  const unregister = useCallback((name: string) => {
    delete rulesRef.current[name]
  }, [])

  if (!formRef.current) {
    formRef.current = {
      getFieldsValue,
      getFieldValue,
      getFieldError,
      clearFieldError,
      setFieldsValue,
      resetFields,
      validateFields,
      __register: register,
      __unregister: unregister
    }
  }

  formRef.current.getFieldsValue = getFieldsValue
  formRef.current.getFieldValue = getFieldValue
  formRef.current.getFieldError = getFieldError
  formRef.current.clearFieldError = clearFieldError
  formRef.current.setFieldsValue = setFieldsValue
  formRef.current.resetFields = resetFields
  formRef.current.validateFields = validateFields
  formRef.current.__register = register
  formRef.current.__unregister = unregister

  return formRef.current
}

const FormComponent: React.FC<{ form?: FormInstance; children: React.ReactNode; layout?: 'vertical' | 'inline'; initialValues?: Record<string, any>; onFinish?: (values: Record<string, any>) => void; onFinishFailed?: (err: unknown) => void; className?: string }> = ({ form, children, layout = 'vertical', initialValues, onFinish, onFinishFailed, className }) => {
	    const internalForm = useFormInternal(initialValues)
	    const formInstance = form ?? internalForm
	    const initialValuesKeyRef = useRef<string | null>(null)

    const register = (name: string, rules?: FieldRule[]) => {
      formInstance.__register?.(name, rules)
    }

    const unregister = (name: string) => {
      formInstance.__unregister?.(name)
    }

    const setValue = (name: string, value: any) => {
      formInstance.setFieldsValue({ [name]: value })
    }

    const getValue = (name: string) => formInstance.getFieldValue(name)

    const clearError = (name: string) => formInstance.clearFieldError(name)
    const getError = (name: string) => formInstance.getFieldError(name)

    const providerValue = useMemo(
      () => ({ register, unregister, setValue, getValue, clearError, getError }),
      [formInstance]
    )

	    useEffect(() => {
	      if (!initialValues) return
	      // Avoid repeated setFieldsValue when initialValues is recreated each render.
	      const nextKey = JSON.stringify(initialValues)
	      if (initialValuesKeyRef.current === nextKey) return
	      initialValuesKeyRef.current = nextKey
	      formInstance.setFieldsValue(initialValues)
	    }, [formInstance, initialValues])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        const values = await formInstance.validateFields()
        onFinish?.(values)
      } catch (err) {
        onFinishFailed?.(err)
      }
    }

    return (
      <FormContext.Provider value={providerValue}>
        <form className={cn(layout === 'inline' ? 'flex flex-wrap items-end gap-4' : 'flex flex-col gap-3', className)} onSubmit={handleSubmit}>
          {children}
        </form>
      </FormContext.Provider>
    )
  }

const FormItemComponent: React.FC<FormItemProps> = ({ label, name, rules, required, children, valuePropName = 'value', className, tooltip }) => {
  const ctx = useContext(FormContext)

  useEffect(() => {
    if (name && ctx) {
      ctx.register(name, rules)
      return () => ctx.unregister(name)
    }
  }, [ctx, name, rules])

  if (!ctx || !name) {
    return (
      <div className={className}>
        {label && <div style={{ marginBottom: 6, fontWeight: 600 }}>{label}</div>}
        {children}
      </div>
    )
  }

  const value = ctx.getValue(name)
  const error = ctx.getError(name)
  const triggerProps: any = {}
  const valueProp = valuePropName || 'value'
  triggerProps[valueProp] = value
  triggerProps.onChange = (val: any) => {
    if (val && val.target) {
      ctx.setValue(name, val.target.value)
    } else {
      ctx.setValue(name, val)
    }
    ctx.clearError(name)
  }

  return (
      <div className={cn('flex flex-col gap-2', className)}>
        {label && (
          <Label className="flex items-center gap-2 text-slate-900 font-semibold">
            {required && <span style={{ color: '#e11d48' }}>*</span>}
            <span>{label}</span>
            {tooltip && <span className="text-slate-400 text-xs">{tooltip}</span>}
          </Label>
        )}
      {React.isValidElement(children) ? React.cloneElement(children as React.ReactElement, triggerProps) : children}
      {error && <div style={{ color: '#e11d48', fontSize: 12 }}>{error}</div>}
    </div>
  )
}

const useFormHook = (initialValues?: Record<string, any>): [FormInstance] => {
  // Call the internal hook on every render to keep hook order stable.
  const formInstance = useFormInternal(initialValues)
  return [formInstance]
}

export const Form = Object.assign(FormComponent, {
  Item: FormItemComponent,
  useForm: useFormHook
})

// ---------------------- Modal ----------------------
export interface ModalProps {
  open?: boolean
  title?: React.ReactNode
  onOk?: () => void | Promise<void>
  onCancel?: () => void
  footer?: React.ReactNode
  children?: React.ReactNode
  width?: number | string
  destroyOnClose?: boolean
  confirmLoading?: boolean
}

export const Modal: React.FC<ModalProps> & { confirm: (opts: { title?: string; content?: React.ReactNode; onOk?: () => void | Promise<void>; onCancel?: () => void }) => void } = ({
  open = false,
  title,
  onOk,
  onCancel,
  footer,
  children,
  width = 520,
  confirmLoading = false
}) => {
  if (!open) return null

  const content = (
    <div className="antd-modal-backdrop">
      <div className="antd-modal" style={{ width }}>
        {title && <div className="antd-modal-header">{title}</div>}
        <div className="antd-modal-body">{children}</div>
        <div className="antd-modal-footer">
          {footer ?? (
            <>
              <Button onClick={onCancel}>取消</Button>
              <Button type="primary" onClick={onOk} disabled={confirmLoading} loading={confirmLoading}>确定</Button>
            </>
          )}
        </div>
      </div>
    </div>
  )

  return ReactDOM.createPortal(content, document.body)
}

Modal.confirm = ({ title, content, onOk, onCancel }) => {
  const confirmed = window.confirm(`${title || '确认'}` + (content ? `\n${content}` : ''))
  if (confirmed) {
    onOk?.()
  } else {
    onCancel?.()
  }
}

// ---------------------- Card / Tag / Space / Typography ----------------------
export const Card: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties; title?: React.ReactNode }> = ({ children, className, style, title }) => (
  <ShadCard className={className} style={style}>
    {title ? (
      <>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">{children}</CardContent>
      </>
    ) : (
      children
    )}
  </ShadCard>
)

export const Tag: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color }) => (
  <Badge style={color ? { background: color, color: '#fff' } : undefined}>{children}</Badge>
)

export const Space: React.FC<{ children: React.ReactNode; size?: number | [number, number]; direction?: 'horizontal' | 'vertical' }> = ({ children, size = 8, direction = 'horizontal' }) => (
  <div className="antd-space" style={{ gap: Array.isArray(size) ? size[0] : size, flexDirection: direction === 'vertical' ? 'column' : 'row' }}>
    {children}
  </div>
)

export const Typography = {
  Text: ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <span style={{ color: '#0f172a', ...style }}>{children}</span>
  ),
  Paragraph: ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <p style={{ margin: 0, color: '#475569', lineHeight: 1.6, ...style }}>{children}</p>
  ),
  Title: ({ level = 3, children, style }: { level?: 1 | 2 | 3 | 4 | 5; children: React.ReactNode; style?: React.CSSProperties }) => {
    const Tag = `h${level}` as any
    return <Tag style={{ margin: 0, color: '#0f172a', fontWeight: 700, ...style }}>{children}</Tag>
  }
}

export const Row: React.FC<{ children: React.ReactNode; gutter?: number | [number, number]; style?: React.CSSProperties }> = ({ children, gutter = 16, style }) => {
  const gap = Array.isArray(gutter) ? gutter[0] : gutter
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap, ...style }}>{children}</div>
}

export const Col: React.FC<{ children: React.ReactNode; span?: number; style?: React.CSSProperties }> = ({ children, span = 24, style }) => {
  const width = `${(span / 24) * 100}%`
  return <div style={{ width, ...style }}>{children}</div>
}

// ---------------------- Tooltip & Menu ----------------------
export const Tooltip: React.FC<{ title: React.ReactNode; placement?: string; children: React.ReactNode }> = ({ children, title }) => (
  <span className="antd-tooltip">
    {children}
    {title && <span className="antd-tooltip-content">{title}</span>}
  </span>
)

export interface MenuItem {
  key: string
  label?: React.ReactNode
  icon?: React.ReactNode
}

export interface MenuProps {
  items: MenuItem[]
  mode?: 'inline' | 'vertical'
  selectedKeys?: string[]
  onClick?: ({ key }: { key: string }) => void
  className?: string
  style?: React.CSSProperties
}

export const Menu: React.FC<MenuProps> = ({ items, selectedKeys = [], onClick, className, style }) => {
  return (
    <div className={cn('flex flex-col', className)} style={{ ...style }}>
      {items.map((item) => (
        <button
          key={item.key}
          className={cn('antd-btn', selectedKeys.includes(item.key) ? 'bg-slate-100' : '')}
          style={{ width: '100%', justifyContent: 'flex-start', gap: 10 }}
          onClick={() => onClick?.({ key: item.key })}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  )
}

// ---------------------- Spin ----------------------
export const Spin: React.FC<{ size?: 'small' | 'default' | 'large'; spinning?: boolean; children?: React.ReactNode }> = ({ size = 'default', spinning = true, children }) => {
  const sizePx = size === 'small' ? 20 : size === 'large' ? 40 : 28
  const spinner = (
    <div className="antd-spin">
      <div className="antd-spin-icon" style={{ width: sizePx, height: sizePx, borderWidth: 3 }} />
    </div>
  )

  if (!children) return spinner

  return (
    <div style={{ position: 'relative' }}>
      {spinning && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5
        }}>
          {spinner}
        </div>
      )}
      <div aria-busy={spinning}>{children}</div>
    </div>
  )
}

// ---------------------- Pagination ----------------------
export const Pagination: React.FC<{
  current: number
  total: number
  pageSize: number
  onChange: (page: number, pageSize: number) => void
  pageSizeOptions?: string[]
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: ((total: number, range: [number, number]) => string) | boolean
}> = ({ current, total, pageSize, onChange, pageSizeOptions = ['10', '20', '50'], showSizeChanger = true, showQuickJumper = true, showTotal }) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const changePage = (page: number) => {
    const next = Math.min(Math.max(1, page), totalPages)
    onChange(next, pageSize)
  }

  return (
    <div className="antd-pagination">
      {showTotal && typeof showTotal === 'function' && (
        <span style={{ marginRight: 12 }}>{showTotal(total, [Math.min((current - 1) * pageSize + 1, total), Math.min(current * pageSize, total)])}</span>
      )}
      <button disabled={current <= 1} onClick={() => changePage(current - 1)}>上一页</button>
      <span>
        {current} / {totalPages}
      </span>
      <button disabled={current >= totalPages} onClick={() => changePage(current + 1)}>下一页</button>
      {showQuickJumper && (
        <input
          type="number"
          min={1}
          max={totalPages}
          style={{ width: 70 }}
          className="antd-input"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const val = Number((e.target as HTMLInputElement).value)
              if (!Number.isNaN(val)) changePage(val)
            }
          }}
        />
      )}
      {showSizeChanger && (
        <select
          className="antd-select"
          style={{ width: 80 }}
          value={String(pageSize)}
          onChange={(e) => onChange(1, Number(e.target.value))}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>{size}/页</option>
          ))}
        </select>
      )}
    </div>
  )
}

// ---------------------- InputNumber ----------------------
export const InputNumber: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return <input type="number" className="antd-input" {...props} />
}

// ---------------------- Empty ----------------------
export const Empty: React.FC<{ description?: React.ReactNode; imageStyle?: React.CSSProperties }> = ({ description = '暂无数据', imageStyle }) => (
  <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8' }}>
    <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 12, ...imageStyle }}>🗒️</div>
    <div>{description}</div>
  </div>
)

// ---------------------- Table ----------------------
export interface ColumnType<T> {
  title?: React.ReactNode
  dataIndex?: string
  key?: React.Key
  width?: number | string
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  ellipsis?: boolean
  render?: (value: any, record: T, index: number) => React.ReactNode
  children?: ColumnType<T>[]
}

export interface TableProps<T> {
  columns: ColumnType<T>[]
  dataSource: T[]
  loading?: boolean
  rowKey?: string | ((record: T) => React.Key)
  rowSelection?: {
    selectedRowKeys?: React.Key[]
    onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void
  }
  onRow?: (record: T) => { onClick?: () => void }
  pagination?: false | PaginationConfig
  scroll?: { x?: boolean | number | string }
  tableLayout?: string
  size?: 'small' | 'middle' | 'large'
}

interface PaginationConfig {
  current: number
  pageSize: number
  total: number
  onChange: (page: number, pageSize: number) => void
}

export const Table = <T extends Record<string, any>>({
  columns,
  dataSource,
  loading = false,
  rowKey = 'id',
  rowSelection,
  onRow,
  pagination = false
}: TableProps<T>) => {
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(rowSelection?.selectedRowKeys || [])

  useEffect(() => {
    if (rowSelection?.selectedRowKeys) {
      setSelectedKeys(rowSelection.selectedRowKeys)
    }
  }, [rowSelection?.selectedRowKeys])

  const getRowKey = (record: T, index: number) => {
    if (typeof rowKey === 'function') return rowKey(record)
    return record[rowKey] ?? index
  }

  const flatColumns = (cols: ColumnType<T>[]): ColumnType<T>[] => cols.flatMap((col) => col.children ? flatColumns(col.children) : col)

  const displayColumns = columns.flatMap((col) => col.children ? col.children : col)

  const toggleSelect = (key: React.Key, record: T) => {
    let nextKeys: React.Key[]
    if (selectedKeys.includes(key)) {
      nextKeys = selectedKeys.filter((k) => k !== key)
    } else {
      nextKeys = [...selectedKeys, key]
    }
    setSelectedKeys(nextKeys)
    rowSelection?.onChange?.(nextKeys, dataSource.filter((item, idx) => nextKeys.includes(getRowKey(item, idx))))
  }

  const paginationNode = pagination && pagination !== false ? (
    <Pagination
      current={pagination.current}
      pageSize={pagination.pageSize}
      total={pagination.total}
      onChange={pagination.onChange}
    />
  ) : null

  return (
    <div className="w-full overflow-auto">
      <table className="antd-table">
        <thead>
          <tr>
            {rowSelection && <th style={{ width: 40 }}></th>}
            {displayColumns.map((col, idx) => (
              <th key={col.key || col.dataIndex || idx} style={{ width: col.width, textAlign: col.align || 'left' }}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={(rowSelection ? 1 : 0) + displayColumns.length}>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                  <Spin />
                </div>
              </td>
            </tr>
          ) : dataSource.length === 0 ? (
            <tr>
              <td colSpan={(rowSelection ? 1 : 0) + displayColumns.length}>
                <Empty />
              </td>
            </tr>
          ) : (
            dataSource.map((record, index) => {
              const key = getRowKey(record, index)
              const rowProps = onRow?.(record) || {}
              return (
                <tr key={key} onClick={rowProps.onClick} style={{ cursor: rowProps.onClick ? 'pointer' : 'default' }}>
                  {rowSelection && (
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={selectedKeys.includes(key)}
                        onChange={() => toggleSelect(key, record)}
                      />
                    </td>
                  )}
                  {displayColumns.map((col, colIdx) => {
                    const value = col.dataIndex ? record[col.dataIndex] : undefined
                    return (
                      <td key={col.key || col.dataIndex || colIdx} style={{ textAlign: col.align || 'left' }}>
                        {col.render ? col.render(value, record, index) : value}
                      </td>
                    )
                  })}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
      {paginationNode}
    </div>
  )
}

// ---------------------- Tree ----------------------
export interface TreeNode {
  key: React.Key
  title: React.ReactNode
  children?: TreeNode[]
}

export interface TreeProps {
  treeData: TreeNode[]
  checkedKeys?: React.Key[]
  onCheck?: (keys: React.Key[] | { checked: React.Key[] }) => void
  checkable?: boolean
  selectable?: boolean
  defaultExpandAll?: boolean
  style?: React.CSSProperties
}

const renderTree = (nodes: TreeNode[], checked: Set<React.Key>, toggle: (key: React.Key) => void) => {
  return nodes.map((node) => (
    <li key={node.key} style={{ listStyle: 'none', marginBottom: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" checked={checked.has(node.key)} onChange={() => toggle(node.key)} />
        <span>{node.title}</span>
      </div>
      {node.children && node.children.length > 0 && (
        <ul style={{ paddingLeft: 18, marginTop: 6 }}>
          {renderTree(node.children, checked, toggle)}
        </ul>
      )}
    </li>
  ))
}

export const Tree: React.FC<TreeProps> = ({ treeData, checkedKeys = [], onCheck, style }) => {
  const [checked, setChecked] = useState<Set<React.Key>>(new Set(checkedKeys))

  useEffect(() => {
    setChecked(new Set(checkedKeys))
  }, [checkedKeys])

  const toggle = (key: React.Key) => {
    const next = new Set(checked)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setChecked(next)
    const arr = Array.from(next)
    onCheck?.(arr)
  }

  return (
    <div style={{ ...style }}>
      <ul style={{ paddingLeft: 0, margin: 0 }}>
        {renderTree(treeData, checked, toggle)}
      </ul>
    </div>
  )
}

// ---------------------- TreeSelect ----------------------
export interface TreeSelectOption {
  title: string
  value: any
  children?: TreeSelectOption[]
}

interface TreeSelectProps {
  value?: any
  treeData?: TreeSelectOption[]
  placeholder?: string
  onChange?: (value: any) => void
  style?: React.CSSProperties
}

const flattenTreeOptions = (nodes: TreeSelectOption[], prefix = ''): { label: string; value: any }[] => {
  let result: { label: string; value: any }[] = []
  nodes.forEach((node) => {
    result.push({ label: `${prefix}${node.title}`, value: node.value })
    if (node.children) {
      result = result.concat(flattenTreeOptions(node.children, `${prefix}— `))
    }
  })
  return result
}

export const TreeSelect: React.FC<TreeSelectProps> = ({ value, treeData = [], placeholder, onChange, style }) => {
  const options = flattenTreeOptions(treeData)
  return (
    <select
      className="antd-select"
      style={style}
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value ? Number(e.target.value) : undefined)}
    >
      <option value="">{placeholder || '请选择'}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}

export type { FormInstance }
