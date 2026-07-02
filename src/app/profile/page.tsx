'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/authStore'
import {
  User,
  Mail,
  Phone,
  Settings,
  ArrowLeft,
  Loader2,
  Building2,
  MapPin,
  ShieldCheck,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // Get initials for avatar
  const initials = useMemo(() => {
    if (!user?.nama_lengkap) return 'U'
    return user.nama_lengkap
      .split(' ')
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
  }, [user])

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-teal-650" />
      </div>
    )
  }

  return (
    <div className="w-full space-y-8 px-4 py-6 sm:px-6 lg:px-8 bg-[#fbffff] min-h-screen">
      <div className="w-full space-y-8">

        {/* Navigation Breadcrumb */}
        <div className="border-b border-slate-200/60 pb-5">
          <nav className="flex text-sm sm:text-base font-bold uppercase tracking-wider text-slate-400 gap-2 items-center">
            <Link href="/" className="hover:text-[#047D78] transition-colors">BERANDA</Link>
            <span className="text-slate-300">/</span>
            <span className="text-[#047D78]">PROFIL SAYA</span>
          </nav>
        </div>

        {/* Premium Profile Intro Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar Circle */}
            <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-3xl font-black text-white shadow-md">
              {initials}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wide">{user.nama_lengkap}</h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-black uppercase text-teal-800 tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {user.level_name || 'Pengguna'}
                </span>
              </div>
              <p className="text-base sm:text-lg text-slate-500 font-semibold">{user.email || '-'}</p>
              <p className="text-sm sm:text-base text-slate-400 font-bold uppercase tracking-wider">
                ID Akun: <span className="font-mono text-slate-600">{user.username}</span>
              </p>
            </div>
          </div>

          <Link
            href="/settings"
            className="flex items-center justify-center gap-2.5 rounded-xl bg-[#047D78] hover:bg-[#036662] text-white px-6 py-3 text-sm font-black uppercase tracking-wider transition-all hover:-translate-y-0.5 active:scale-[0.98] shrink-0"
          >
            <Settings className="h-4.5 w-4.5" />
            <span>Ubah Profil</span>
          </Link>
        </div>

        {/* Profile Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Column 1: Informasi Biodata & Kontak */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2.5">
                <User className="h-5.5 w-5.5 text-teal-650 shrink-0" />
                Informasi Biodata & Kontak
              </h2>
            </div>

            <div className="space-y-5">
              {/* Nama Lengkap */}
              <div className="space-y-1">
                <span className="text-sm font-black text-slate-400 uppercase tracking-wider">Nama Lengkap</span>
                <p className="text-base sm:text-lg font-bold text-slate-800">{user.nama_lengkap || '-'}</p>
              </div>

              {/* Username */}
              <div className="space-y-1">
                <span className="text-sm font-black text-slate-400 uppercase tracking-wider">Username Pengguna</span>
                <p className="text-base sm:text-lg font-mono font-bold text-slate-800">{user.username || '-'}</p>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <span className="text-sm font-black text-slate-400 uppercase tracking-wider">Alamat Email</span>
                <p className="text-base sm:text-lg font-bold text-slate-800">{user.email || '-'}</p>
              </div>

              {/* No Telepon */}
              <div className="space-y-1">
                <span className="text-sm font-black text-slate-400 uppercase tracking-wider">No. Telepon / WA</span>
                <p className="text-base sm:text-lg font-bold text-slate-800">{user.no_telpon || '-'}</p>
              </div>
            </div>
          </div>

          {/* Column 2: Hak Akses & Detail Wilayah */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2.5">
                <Layers className="h-5.5 w-5.5 text-teal-650 shrink-0" />
                Hak Akses & Cakupan Wilayah
              </h2>
            </div>

            <div className="space-y-5">
              {/* Level User */}
              <div className="space-y-1">
                <span className="text-sm font-black text-slate-400 uppercase tracking-wider">Level Kewenangan</span>
                <p className="text-base sm:text-lg font-bold text-teal-800 uppercase tracking-wide">{user.level_name || 'User'}</p>
              </div>

              {/* Cakupan Wilayah */}
              <div className="space-y-1">
                <span className="text-sm font-black text-slate-400 uppercase tracking-wider">Cakupan Wilayah Kerja</span>
                <p className="text-base sm:text-lg font-bold text-slate-800">{user.wilayah_scope?.access_label || 'Nasional'}</p>
              </div>

              {/* Provinsi */}
              {user.wilayah_scope?.provinsi?.id && (
                <div className="space-y-1">
                  <span className="text-sm font-black text-slate-400 uppercase tracking-wider">Provinsi Penugasan</span>
                  <p className="text-base sm:text-lg font-bold text-slate-800">{user.wilayah_scope.provinsi.label}</p>
                </div>
              )}

              {/* Kabupaten */}
              {user.wilayah_scope?.kabupaten?.id && (
                <div className="space-y-1">
                  <span className="text-sm font-black text-slate-400 uppercase tracking-wider">Kabupaten / Kota Penugasan</span>
                  <p className="text-base sm:text-lg font-bold text-slate-800">{user.wilayah_scope.kabupaten.label}</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Metadata Pendaftaran Tambahan (jika terdaftar sebagai Masyarakat/Mitra) */}
        {user.registration_details && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2.5">
                <Briefcase className="h-5.5 w-5.5 text-teal-650 shrink-0" />
                Informasi Domisili & Afiliasi Publik
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kategori Akses */}
              <div className="space-y-1">
                <span className="text-sm font-black text-slate-400 uppercase tracking-wider">Kategori Akses Publik</span>
                <p className="text-base sm:text-lg font-bold text-slate-800 capitalize">{user.registration_details.kategori_akses || '-'}</p>
              </div>

              {/* Pekerjaan */}
              <div className="space-y-1">
                <span className="text-sm font-black text-slate-400 uppercase tracking-wider">Pekerjaan / Jabatan</span>
                <p className="text-base sm:text-lg font-bold text-slate-800">{user.registration_details.pekerjaan_posisi || '-'}</p>
              </div>

              {/* Nama Institusi */}
              <div className="space-y-1">
                <span className="text-sm font-black text-slate-400 uppercase tracking-wider">Nama Institusi / Organisasi</span>
                <p className="text-base sm:text-lg font-bold text-slate-800">{user.registration_details.nama_institusi || '-'}</p>
              </div>

              {/* Tujuan Akses */}
              <div className="space-y-1">
                <span className="text-sm font-black text-slate-400 uppercase tracking-wider">Tujuan Akses Data</span>
                <p className="text-base sm:text-lg font-bold text-slate-800">
                  {user.registration_details.tujuan_akses === 'lainnya'
                    ? user.registration_details.tujuan_akses_lainnya
                    : user.registration_details.tujuan_akses || '-'
                  }
                </p>
              </div>

              {/* Domisili Provinsi */}
              <div className="space-y-1">
                <span className="text-sm font-black text-slate-400 uppercase tracking-wider">Provinsi Domisili</span>
                <p className="text-base sm:text-lg font-bold text-slate-800">{user.registration_details.provinsi_name || '-'}</p>
              </div>

              {/* Domisili Kabupaten */}
              <div className="space-y-1">
                <span className="text-sm font-black text-slate-400 uppercase tracking-wider">Kabupaten / Kota Domisili</span>
                <p className="text-base sm:text-lg font-bold text-slate-800">{user.registration_details.kabupaten_name || '-'}</p>
              </div>

              {/* Alamat Domisili */}
              <div className="space-y-1 md:col-span-2">
                <span className="text-sm font-black text-slate-400 uppercase tracking-wider">Alamat Lengkap Domisili</span>
                <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed">{user.registration_details.alamat_user || '-'}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
