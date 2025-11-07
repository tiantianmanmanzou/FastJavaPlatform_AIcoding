import { getToken } from './storage'

export function isAuthenticated(): boolean {
  return Boolean(getToken())
}
