'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/authStore'
import { buildApiUrl } from '@/lib/utils/api'
import {
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Settings,
  User,
  ShieldAlert,
  Save,
  ArrowLeft,
  Check,
  X
} from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const router = useRouter()
  const { user, token, login, logout, isAuthenticated } = useAuthStore()
  const baseApiUrl = useMemo(() => buildApiUrl('/api'), [])

  // Active Tab: 'profile' | 'password'
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')

  // Profile Form States
  const [username, setUsername] = useState('')
  const [namaLengkap, setNamaLengkap] = useState('')
  const [email, setEmail] = useState('')
  const [noTelpon, setNoTelpon] = useState('')

  // Password Form States
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Realtime password checks
  const pwdChecks = useMemo(() => {
    return {
      minLength: newPassword.length >= 8,
      hasUpper: /[A-Z]/.test(newPassword),
      hasLower: /[a-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecial: /[@$!%*?&]/.test(newPassword),
    }
  }, [newPassword])

  const isPasswordValid =
    pwdChecks.minLength &&
    pwdChecks.hasUpper &&
    pwdChecks.hasLower &&
    pwdChecks.hasNumber &&
    pwdChecks.hasSpecial

  // Strength score: 0 to 5 based on checklist
  const strengthScore = useMemo(() => {
    if (!newPassword) return 0
    let score = 0
    if (pwdChecks.minLength) score++
    if (pwdChecks.hasUpper) score++
    if (pwdChecks.hasLower) score++
    if (pwdChecks.hasNumber) score++
    if (pwdChecks.hasSpecial) score++
    return score
  }, [newPassword, pwdChecks])

  // Realtime missing checks list
  const missingChecks = useMemo(() => {
    const list = []
    if (!pwdChecks.minLength) list.push('min. 8 karakter')
    if (!pwdChecks.hasUpper) list.push('huruf besar')
    if (!pwdChecks.hasLower) list.push('huruf kecil')
    if (!pwdChecks.hasNumber) list.push('angka')
    if (!pwdChecks.hasSpecial) list.push('simbol khusus')
    return list
  }, [pwdChecks])

  // UI States
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load initial user details
  useEffect(() => {
    if (user) {
      setUsername(user.username || '')
      setNamaLengkap(user.nama_lengkap || '')
      setEmail(user.email || '')
      setNoTelpon(user.no_telpon || '')
    }
  }, [user])

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-teal-650" />
      </div>
    )
  }

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch(`${baseApiUrl}/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username,
          nama_lengkap: namaLengkap,
          email,
          no_telpon: noTelpon
        })
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Gagal memperbarui profil.')
      }

      // Update zustand store state with the new token and user data
      if (data.token && data.user) {
        login(data.token, data.user)
      }

      setSuccess('Profil Anda berhasil diperbarui.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem.')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('Password baru dan konfirmasi password tidak cocok.')
      return
    }

    if (!isPasswordValid) {
      setError('Kata sandi baru belum memenuhi kriteria keamanan.')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('old_password', oldPassword)
      formData.append('new_password', newPassword)
      if (user?.id_user) {
        formData.append('user_id', String(user.id_user))
      }

      const response = await fetch(`${baseApiUrl}/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Gagal mengubah password.')
      }

      setSuccess('Password berhasil diubah. Mengalihkan ke halaman masuk...')

      // Clear forms
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')

      // Wait 2 seconds then logout and redirect
      setTimeout(() => {
        logout()
        router.push('/login')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8 bg-[#fbffff] min-h-screen">
      <div className="w-full space-y-8">

        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-2">
          <Link href="/" className="inline-flex items-center gap-2 text-[#047D78] hover:text-[#036662] font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 hover:-translate-x-1">
            <ArrowLeft className="h-4 w-4 stroke-[3]" />
            Kembali ke Dashboard
          </Link>
        </div>

        {/* Page Title & Profile Badge */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200/60 pb-6 gap-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">Pengaturan Akun</h1>
              <p className="text-slate-500 text-sm sm:text-base font-semibold mt-1">Kelola informasi profil, detail akun, dan kata sandi keamanan Anda.</p>
            </div>
          </div>
          <div className="bg-teal-50/60 border border-teal-100/80 rounded-2xl px-5 py-2.5 self-start md:self-auto shadow-[0_4px_12px_rgba(4,125,120,0.05)] flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wider">
              Akses Level: <strong className="text-teal-800 font-black">{user.level_name || 'User'}</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Sidebar Tabs */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setActiveTab('profile'); setError(''); setSuccess('') }}
              className={`flex items-center gap-3 rounded-2xl px-5 py-4 text-left text-sm font-black uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${activeTab === 'profile'
                  ? 'bg-teal-750 text-white shadow-[0_6px_20px_rgba(4,125,120,0.25)]'
                  : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-teal-50/20 hover:border-teal-200/50 hover:text-[#047D78] shadow-sm'
                }`}
              style={{ backgroundColor: activeTab === 'profile' ? '#047D78' : undefined }}
            >
              <User className="h-4.5 w-4.5 shrink-0" />
              <span>Profil Akun</span>
            </button>
            <button
              onClick={() => { setActiveTab('password'); setError(''); setSuccess('') }}
              className={`flex items-center gap-3 rounded-2xl px-5 py-4 text-left text-sm font-black uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${activeTab === 'password'
                  ? 'bg-teal-750 text-white shadow-[0_6px_20px_rgba(4,125,120,0.25)]'
                  : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-teal-50/20 hover:border-teal-200/50 hover:text-[#047D78] shadow-sm'
                }`}
              style={{ backgroundColor: activeTab === 'password' ? '#047D78' : undefined }}
            >
              <LockKeyhole className="h-4.5 w-4.5 shrink-0" />
              <span>Keamanan Sandi</span>
            </button>
          </div>

          {/* Form Content Card */}
          <div className="w-full px-2 sm:px-6">

              {/* Alert message displays */}
              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/60 px-5 py-4 text-xs sm:text-sm font-bold text-red-700 shadow-sm animate-shake">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-650" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}
              {success && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-250 bg-emerald-50/60 px-5 py-4 text-xs sm:text-sm font-bold text-emerald-800 shadow-sm animate-pulse">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                  <span className="leading-relaxed">{success}</span>
                </div>
              )}

              {/* Tab 1: Profile Form */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">Ubah Informasi Profil</h2>
                    <p className="text-sm text-slate-500 font-semibold mt-1">Perbarui detail biodata diri dan informasi kontak aktif Anda.</p>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Username */}
                      <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-black text-slate-500 uppercase tracking-wider">Username</label>
                        <div className="flex h-12 items-center gap-3.5 rounded-xl border border-slate-200 bg-slate-50/50 px-4 transition-all duration-200 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-100">
                          <UserRound className="h-[20px] w-[20px] text-slate-400 shrink-0" />
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Username akun Anda"
                            className="h-full min-w-0 flex-1 bg-transparent text-sm sm:text-base font-bold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-medium"
                          />
                        </div>
                      </div>

                      {/* Full Name */}
                      <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-black text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
                        <div className="flex h-12 items-center gap-3.5 rounded-xl border border-slate-200 bg-slate-50/50 px-4 transition-all duration-200 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-100">
                          <User className="h-[20px] w-[20px] text-slate-400 shrink-0" />
                          <input
                            type="text"
                            value={namaLengkap}
                            onChange={(e) => setNamaLengkap(e.target.value)}
                            required
                            placeholder="Nama Lengkap Anda"
                            className="h-full min-w-0 flex-1 bg-transparent text-sm sm:text-base font-bold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-medium"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-black text-slate-500 uppercase tracking-wider">Alamat Email</label>
                        <div className="flex h-12 items-center gap-3.5 rounded-xl border border-slate-200 bg-slate-50/50 px-4 transition-all duration-200 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-100">
                          <Mail className="h-[20px] w-[20px] text-slate-400 shrink-0" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="nama@domain.com"
                            className="h-full min-w-0 flex-1 bg-transparent text-sm sm:text-base font-bold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-medium"
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-black text-slate-500 uppercase tracking-wider">No. Telepon / WA</label>
                        <div className="flex h-12 items-center gap-3.5 rounded-xl border border-slate-200 bg-slate-50/50 px-4 transition-all duration-200 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-100">
                          <Phone className="h-[20px] w-[20px] text-slate-400 shrink-0" />
                          <input
                            type="text"
                            value={noTelpon}
                            onChange={(e) => setNoTelpon(e.target.value)}
                            placeholder="Contoh: 08123456789"
                            className="h-full min-w-0 flex-1 bg-transparent text-sm sm:text-base font-bold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Read-Only Account & Access Metadata (Visible to all users) */}
                    <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                      <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Informasi Akun & Hak Akses</h3>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">Detail tingkat kewenangan dan wilayah kerja penugasan Anda.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50/40 border border-slate-100/80 rounded-2xl p-5 shadow-sm">
                        {/* Level User */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Level Pengguna</span>
                          <p className="text-sm font-bold text-teal-800 uppercase tracking-wide">{user?.level_name || 'User'}</p>
                        </div>

                        {/* Cakupan Wilayah */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Cakupan Wilayah Kerja</span>
                          <p className="text-sm font-bold text-slate-700">{user?.wilayah_scope?.access_label || 'Nasional'}</p>
                        </div>

                        {/* Detail Provinsi Kerja (jika bukan nasional) */}
                        {user?.wilayah_scope?.provinsi?.id && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Provinsi Penugasan</span>
                            <p className="text-sm font-bold text-slate-700">{user.wilayah_scope.provinsi.label}</p>
                          </div>
                        )}

                        {/* Detail Kabupaten Kerja (jika ada kabupaten terkunci) */}
                        {user?.wilayah_scope?.kabupaten?.id && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Kabupaten / Kota Penugasan</span>
                            <p className="text-sm font-bold text-slate-700">{user.wilayah_scope.kabupaten.label}</p>
                          </div>
                        )}

                        {/* Additional Metadata for registered Masyarakat */}
                        {user?.registration_details && (
                          <>
                            <div className="border-t border-slate-100/80 md:col-span-2 my-2" />

                            {/* Kategori Akses */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Kategori Akses</span>
                              <p className="text-sm font-bold text-slate-700 capitalize">{user.registration_details.kategori_akses || '-'}</p>
                            </div>

                            {/* Pekerjaan / Posisi */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pekerjaan / Jabatan</span>
                              <p className="text-sm font-bold text-slate-700">{user.registration_details.pekerjaan_posisi || '-'}</p>
                            </div>

                            {/* Nama Institusi */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Nama Institusi</span>
                              <p className="text-sm font-bold text-slate-700">{user.registration_details.nama_institusi || '-'}</p>
                            </div>

                            {/* Tujuan Akses */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Tujuan Akses</span>
                              <p className="text-sm font-bold text-slate-700">
                                {user.registration_details.tujuan_akses === 'lainnya' 
                                  ? user.registration_details.tujuan_akses_lainnya 
                                  : user.registration_details.tujuan_akses || '-'
                                }
                              </p>
                            </div>

                            {/* Provinsi Pendaftaran */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Provinsi Domisili</span>
                              <p className="text-sm font-bold text-slate-700">{user.registration_details.provinsi_name || '-'}</p>
                            </div>

                            {/* Kabupaten Pendaftaran */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Kabupaten / Kota Domisili</span>
                              <p className="text-sm font-bold text-slate-700">{user.registration_details.kabupaten_name || '-'}</p>
                            </div>

                            {/* Alamat */}
                            <div className="space-y-1 md:col-span-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Alamat Lengkap</span>
                              <p className="text-sm font-bold text-slate-700 leading-relaxed">{user.registration_details.alamat_user || '-'}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 px-8 text-sm font-black uppercase tracking-wider text-white transition-all shadow-[0_4px_14px_rgba(15,118,110,0.25)] hover:shadow-[0_6px_20px_rgba(15,118,110,0.35)] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-75 disabled:cursor-wait"
                        style={{ backgroundColor: '#047D78' }}
                      >
                        {loading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Save className="h-5 w-5" />
                        )}
                        <span>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tab 2: Password Form */}
              {activeTab === 'password' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">Ubah Kata Sandi</h2>
                    <p className="text-sm text-slate-500 font-semibold mt-1">Perbarui kata sandi untuk menjaga keamanan akun Anda.</p>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 px-5 py-4 text-xs sm:text-sm font-bold text-amber-900 shadow-sm leading-relaxed">
                    <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 animate-bounce" />
                    <span>Setelah berhasil mengganti password, Anda akan otomatis keluar secara aman dan harus login kembali dengan kata sandi baru.</span>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-6">
                    {/* Old Password */}
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-black text-slate-500 uppercase tracking-wider">Kata Sandi Lama</label>
                      <div className="flex h-12 items-center gap-3.5 rounded-xl border border-slate-200 bg-slate-50/50 px-4 transition-all duration-200 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-100">
                        <LockKeyhole className="h-[20px] w-[20px] text-slate-400 shrink-0" />
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          required
                          placeholder="Masukkan kata sandi saat ini"
                          className="h-full min-w-0 flex-1 bg-transparent text-sm sm:text-base font-bold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* New Password */}
                      <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-black text-slate-500 uppercase tracking-wider">Kata Sandi Baru</label>
                        <div className="flex h-12 items-center gap-3.5 rounded-xl border border-slate-200 bg-slate-50/50 px-4 transition-all duration-200 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-100">
                          <KeyRound className="h-[20px] w-[20px] text-slate-400 shrink-0" />
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Minimal 8 karakter"
                            className="h-full min-w-0 flex-1 bg-transparent text-sm sm:text-base font-bold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-medium"
                          />
                        </div>

                        {/* Realtime dynamic warning in 1 row */}
                        {newPassword.length > 0 && (
                          <div className="mt-2.5 text-xs font-bold leading-normal">
                            {missingChecks.length > 0 ? (
                              <div className="flex flex-wrap items-center gap-1.5 text-red-650 bg-red-50/40 border border-red-100/50 rounded-xl px-3 py-2">
                                <X className="h-4 w-4 shrink-0 text-red-500 stroke-[3]" />
                                <span>Sandi kurang:</span>
                                <span className="font-black text-[10.5px] uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                  {missingChecks.join(', ')}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50/40 border border-emerald-100/50 rounded-xl px-3 py-2">
                                <Check className="h-4 w-4 shrink-0 text-emerald-600 stroke-[3]" />
                                <span>Kriteria keamanan kata sandi terpenuhi</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-black text-slate-500 uppercase tracking-wider">Konfirmasi Sandi Baru</label>
                        <div className="flex h-12 items-center gap-3.5 rounded-xl border border-slate-200 bg-slate-50/50 px-4 transition-all duration-200 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-100">
                          <KeyRound className="h-[20px] w-[20px] text-slate-400 shrink-0" />
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Ulangi kata sandi baru"
                            className="h-full min-w-0 flex-1 bg-transparent text-sm sm:text-base font-bold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 px-8 text-sm font-black uppercase tracking-wider text-white transition-all shadow-[0_4px_14px_rgba(15,118,110,0.25)] hover:shadow-[0_6px_20px_rgba(15,118,110,0.35)] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-75 disabled:cursor-wait"
                        style={{ backgroundColor: '#047D78' }}
                      >
                        {loading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Save className="h-5 w-5" />
                        )}
                        <span>{loading ? 'Mengubah...' : 'Ubah Kata Sandi'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
