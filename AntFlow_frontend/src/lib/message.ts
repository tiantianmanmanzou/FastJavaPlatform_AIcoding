import { toast } from 'sonner'

type MessageFn = (content: string) => void

interface MessageApi {
  success: MessageFn
  error: MessageFn
  warning: MessageFn
  info: MessageFn
  loading: MessageFn
}

export const message: MessageApi = {
  success: (content) => toast.success(content),
  error: (content) => toast.error(content),
  warning: (content) => toast.warning(content),
  info: (content) => toast.info(content),
  loading: (content) => toast.loading(content)
}

