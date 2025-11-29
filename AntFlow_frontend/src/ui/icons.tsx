import React from 'react'
import {
  Plus,
  Search,
  RefreshCcw,
  ShoppingCart,
  CheckCircle2,
  Eye,
  Lock,
  User,
  ShieldCheck,
  Key,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react'

type IconProps = { className?: string; style?: React.CSSProperties }

const iconWrapper = (Comp: any) => (props: IconProps) => <Comp size={18} strokeWidth={2} {...props} />

export const PlusOutlined = iconWrapper(Plus)
export const SearchOutlined = iconWrapper(Search)
export const ReloadOutlined = iconWrapper(RefreshCcw)
export const ShoppingOutlined = iconWrapper(ShoppingCart)
export const CheckCircleOutlined = iconWrapper(CheckCircle2)
export const EyeOutlined = iconWrapper(Eye)
export const LockOutlined = iconWrapper(Lock)
export const UserOutlined = iconWrapper(User)
export const SafetyOutlined = iconWrapper(ShieldCheck)
export const KeyOutlined = iconWrapper(Key)
export const LeftOutlined = iconWrapper(ChevronLeft)
export const RightOutlined = iconWrapper(ChevronRight)
export const DownOutlined = iconWrapper(ChevronDown)
