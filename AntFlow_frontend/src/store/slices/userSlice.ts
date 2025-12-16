import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../../types'
import { getToken as getStoredToken } from '../../utils/storage'

interface UserState {
  userInfo: User | null
  token: string | null
  isAuthenticated: boolean
}

const storedToken = getStoredToken()

const initialState: UserState = {
  userInfo: null,
  token: storedToken ?? null,
  isAuthenticated: Boolean(storedToken),
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<User>) => {
      state.userInfo = action.payload
      state.isAuthenticated = true
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      state.isAuthenticated = Boolean(action.payload)
    },
    logout: (state) => {
      state.userInfo = null
      state.token = null
      state.isAuthenticated = false
    },
  },
})

export const { setUserInfo, setToken, logout } = userSlice.actions
export default userSlice.reducer
