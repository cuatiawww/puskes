import { create } from 'zustand'

export interface User {
  id_user: number
  username: string
  email: string
  nama_lengkap: string
  no_telpon?: string
  level_user_id: number
  level_name?: string
  wilayah_scope?: WilayahScope
  registration_details?: {
    kategori_akses: string
    nama_institusi?: string
    pekerjaan_posisi?: string
    tujuan_akses: string
    tujuan_akses_lainnya?: string
    alamat_user?: string
    provinsi_id?: number
    provinsi_name?: string
    kabupaten_id?: number
    kabupaten_name?: string
  } | null
}

export type WilayahScopeMode = 'all' | 'provinsi' | 'kabupaten'

export interface WilayahScopeOption {
  id?: string | number | null
  value?: string
  label: string
  locked: boolean
  options?: Array<{
    id: string | number
    label: string
  }>
}

export interface WilayahScope {
  mode: WilayahScopeMode
  access_label: string
  cakupan: WilayahScopeOption
  provinsi: WilayahScopeOption
  kabupaten: WilayahScopeOption
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isGuest: boolean
  isInitialized: boolean
  login: (token: string, user: User) => void
  loginAsGuest: () => void
  logout: (preventRedirect?: boolean) => void
  initialize: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isInitialized: false,
  login: (token, user) => {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_user', JSON.stringify(user))
    localStorage.removeItem('auth_guest')
    set({ token, user, isAuthenticated: true, isGuest: false })
  },
  loginAsGuest: () => {
    localStorage.setItem('auth_guest', 'true')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    set({ token: null, user: null, isAuthenticated: false, isGuest: true })
  },
  logout: (preventRedirect) => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_guest')
    set({ token: null, user: null, isAuthenticated: false, isGuest: false })

    if (!preventRedirect && typeof window !== 'undefined') {
      const backendBaseUrl = process.env.NEXT_PUBLIC_SIPKK_BACKEND_BASE_URL || 'https://puskesmas-be.mediaciptainformasi.co.id'
      const returnUrl = `${window.location.origin}/login`
      window.location.href = `${backendBaseUrl.replace(/\/+$/, '')}/site/logout?return=${encodeURIComponent(returnUrl)}`
    }
  },
  initialize: () => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('auth_token')
    const userStr = localStorage.getItem('auth_user')
    const isGuestStr = localStorage.getItem('auth_guest')
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        set({ token, user, isAuthenticated: true, isGuest: false, isInitialized: true })
      } catch (e) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        set({ token: null, user: null, isAuthenticated: false, isGuest: false, isInitialized: true })
      }
    } else if (isGuestStr === 'true') {
      set({ token: null, user: null, isAuthenticated: false, isGuest: true, isInitialized: true })
    } else {
      set({ isInitialized: true, isGuest: false })
    }
  }
}))
