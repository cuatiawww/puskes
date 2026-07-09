/**
 * URL builder untuk request frontend.
 *
 * Semua request ke backend dilakukan via API proxy Next.js (server-side)
 * untuk menghindari CORS issue. Tidak ada lagi referensi ke /web_api/.
 *
 * Backend utama: web.php → ApiController
 */

const BACKEND_BASE_URL = (
  process.env.NEXT_PUBLIC_SIPKK_BACKEND_BASE_URL ||
  'https://puskesmas-be.mediaciptainformasi.co.id'
).replace(/\/+$/, '')

/**
 * Base URL API backend (untuk client-side direct calls seperti login/captcha
 * yang sudah dikonfigurasi CORS di backend).
 */
export function getApiBaseUrl(): string {
  return `${BACKEND_BASE_URL}/api`
}

/**
 * Build URL langsung ke backend (untuk login, captcha, regions, dll).
 * Hanya gunakan ini untuk endpoint yang sudah CORS-safe.
 */
export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (normalizedPath === '/api') {
    return getApiBaseUrl()
  }

  // Semua /api/... → langsung ke backend utama (web.php / ApiController)
  if (normalizedPath.startsWith('/api/')) {
    return `${BACKEND_BASE_URL}${normalizedPath}`
  }

  // Fallback
  return `${getApiBaseUrl()}${normalizedPath}`
}

/**
 * Resolves relative backend asset URLs (uploads, serve-image, file-upload render, hashes)
 * to absolute URLs pointing to the backend server.
 */
export function resolveBackendAssetUrl(url: string | undefined | null): string {
  if (!url) return ''

  // If it's already an absolute URL, return as is
  if (/^(https?:)?\/\//i.test(url)) {
    return url
  }

  // Remove leading slash for uniform check
  const cleanPath = url.replace(/^\/+/, '')

  // Check if it is a file asset hash (e.g., length > 20, no slashes or dots)
  if (!cleanPath.includes('/') && !cleanPath.includes('.') && cleanPath.length > 20) {
    return `${BACKEND_BASE_URL}/file-upload/render?inline=1&uxid=${encodeURIComponent(cleanPath)}`
  }

  // Check if it's a known backend uploaded path structure
  if (
    cleanPath.startsWith('uploads/') ||
    cleanPath.startsWith('system-setting/') ||
    cleanPath.startsWith('file-upload/')
  ) {
    return `${BACKEND_BASE_URL}/${cleanPath}`
  }

  // For any other relative path, if it doesn't match local public assets, prepend backend base URL
  const localPublicAssets = ['logo-kemenkes.png', 'pkk.png', 'kemenkes.png']
  const isLocal = localPublicAssets.some(asset => cleanPath.toLowerCase() === asset.toLowerCase())

  if (isLocal) {
    return `/${cleanPath}`
  }

  return `${BACKEND_BASE_URL}/${cleanPath}`
}

/**
 * URL untuk bencana-stats — selalu via proxy Next.js (server-side)
 * agar tidak ada CORS. Endpoint ini PUBLIC — tidak perlu token.
 * Wilayah scope dikirim terpisah jika diperlukan.
 */
export function buildBencanaStatsUrl(): string {
  return `/api/bencana-stats`
}

/**
 * URL regions — langsung ke backend (public endpoint, CORS sudah dikonfigurasi).
 */
export function buildRegionsUrl(query?: Record<string, string>): string {
  const params = query ? new URLSearchParams(query).toString() : ''
  const queryString = params ? `?${params}` : ''
  return `${BACKEND_BASE_URL}/api/regions${queryString}`
}
