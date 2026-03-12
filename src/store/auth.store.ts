import { create } from 'zustand'
import { AuthUser } from '@/types'
import api from '@/lib/api'

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
  hasPermission: (atom: string) => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const { data } = await api.post('/auth/login', { email, password })
      const { accessToken } = data.data
      sessionStorage.setItem('accessToken', accessToken)

      // Fetch full user with permissions
      const meRes = await api.get('/auth/me')
      const me = meRes.data.data

      set({
        user: {
          id:          me.id,
          email:       me.email,
          firstName:   me.first_name,
          lastName:    me.last_name,
          role:        me.role,
          permissions: me.permissions || [],
        },
        isAuthenticated: true,
      })
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch {}
    sessionStorage.removeItem('accessToken')
    set({ user: null, isAuthenticated: false })
  },

  fetchMe: async () => {
    const token = sessionStorage.getItem('accessToken')
    if (!token) return
    try {
      const { data } = await api.get('/auth/me')
      const me = data.data
      set({
        user: {
          id:          me.id,
          email:       me.email,
          firstName:   me.first_name,
          lastName:    me.last_name,
          role:        me.role,
          permissions: me.permissions || [],
        },
        isAuthenticated: true,
      })
    } catch {
      sessionStorage.removeItem('accessToken')
      set({ user: null, isAuthenticated: false })
    }
  },

  hasPermission: (atom: string) => {
    const { user } = get()
    return user?.permissions?.includes(atom) ?? false
  },
}))