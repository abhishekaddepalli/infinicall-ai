import { authUtils } from '@/utils/auth'
import { createSlice } from '@reduxjs/toolkit'
import { AuthState } from '@/types'

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth: (state) => {
      const token = authUtils.getToken()
      const user = authUtils.getUser()

      if (token && user) {
        state.token = token
        state.user = user
        state.isAuthenticated = true
      }
      state.isLoading = false
    },
    setAuth: (state, action) => {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true
    },
    clearAuth: (state) => {
      state.token = null
      state.user = null
      state.isAuthenticated = false
    },
  },
  extraReducers: (builder) => {
    // Sync profile for Admin / User roles
    builder.addMatcher(
      (action) =>
        action.type === 'api/executeQuery/fulfilled' && action.meta?.arg?.endpointName === 'getProfile',
      (state, action: any) => {
        if (action.payload?.user) {
          const userWithPermissions = {
            ...action.payload.user,
            permissions: action.payload.user.permissions || action.payload.permissions || action.payload.user.permissionSlugs || [],
          }
          state.user = userWithPermissions
          authUtils.setUser(userWithPermissions)
        }
      },
    )
    // Sync profile for Team Member role
    builder.addMatcher(
      (action) =>
        action.type === 'api/executeQuery/fulfilled' && action.meta?.arg?.endpointName === 'getTeamMemberProfile',
      (state, action: any) => {
        if (action.payload?.user) {
          const userWithPermissions = {
            ...action.payload.user,
            permissions: action.payload.user.permissionSlugs || [],
          }
          state.user = userWithPermissions
          authUtils.setUser(userWithPermissions)
        }
      },
    )
  },
})

export const { initializeAuth, setAuth, clearAuth } = authSlice.actions
export default authSlice.reducer
