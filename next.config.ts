import type { NextConfig } from "next";

const backendBaseUrl = (
  process.env.SIPKK_BACKEND_BASE_URL ||
  'https://puskesmas-be.mediaciptainformasi.co.id'
).replace(/\/+$/, '')

// Extract hostname from backend base url
let backendHostname = "puskesmas-be.mediaciptainformasi.co.id";
try {
  const url = new URL(backendBaseUrl);
  backendHostname = url.hostname;
} catch (e) {
  // Ignore
}

const nextConfig: NextConfig = {
  serverExternalPackages: ['svg-captcha'],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: backendHostname,
      },
      {
        protocol: 'https',
        hostname: backendHostname,
      },
    ],
  },
  async rewrites() {
    return {
      fallback: [
        // Semua /api/* yang tidak ada dedicated route.ts → proxy ke backend utama (web.php)
        {
          source: '/api/:path*',
          destination: `${backendBaseUrl}/api/:path*`,
        },
      ],
    }
  },
};

export default nextConfig;
