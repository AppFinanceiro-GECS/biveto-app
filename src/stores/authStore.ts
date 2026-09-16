import { create } from 'zustand'

import { isTokenExpired } from '@/lib/jwt'
import { secureStorage } from '@/lib/storage'
import type { Token, User } from '@/types/api'

const ACCESS_KEY = 'biveto.access_token'
const REFRESH_KEY = 'biveto.refresh_token'

type AuthStatus = 'loading' | 'signedOut' | 'signedIn'

interface AuthState {
  status: AuthStatus
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  /** Lê os tokens salvos no boot do app. */
  hydrate: () => Promise<void>
  signIn: (tokens: Token) => Promise<void>
  setTokens: (tokens: Token) => Promise<void>
  setUser: (user: User | null) => void
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
  status: 'loading',
  accessToken: null,
  refreshToken: null,
  user: null,

  hydrate: async () => {
    const [accessToken, refreshToken] = await Promise.all([
      secureStorage.get(ACCESS_KEY),
      secureStorage.get(REFRESH_KEY),
    ])
    if (!refreshToken || isTokenExpired(refreshToken, 60)) {
      await Promise.all([secureStorage.remove(ACCESS_KEY), secureStorage.remove(REFRESH_KEY)])
      set({ status: 'signedOut', accessToken: null, refreshToken: null })
      return
    }
    set({ status: 'signedIn', accessToken, refreshToken })
  },

  signIn: async (tokens) => {
    await Promise.all([
      secureStorage.set(ACCESS_KEY, tokens.access_token),
      secureStorage.set(REFRESH_KEY, tokens.refresh_token),
    ])
    set({ status: 'signedIn', accessToken: tokens.access_token, refreshToken: tokens.refresh_token })
  },

  setTokens: async (tokens) => {
    await Promise.all([
      secureStorage.set(ACCESS_KEY, tokens.access_token),
      secureStorage.set(REFRESH_KEY, tokens.refresh_token),
    ])
    set({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token })
  },

  setUser: (user) => set({ user }),

  signOut: async () => {
    await Promise.all([secureStorage.remove(ACCESS_KEY), secureStorage.remove(REFRESH_KEY)])
    set({ status: 'signedOut', accessToken: null, refreshToken: null, user: null })
  },
}))
