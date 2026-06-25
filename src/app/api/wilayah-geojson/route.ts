import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const level = searchParams.get('level') || ''

  if (level === 'provinsi') {
    try {
      const filePath = path.join(process.cwd(), 'public', 'indonesia-provinces.geojson')
      const fileData = await fs.readFile(filePath, 'utf8')
      const geojson = JSON.parse(fileData)

      return NextResponse.json({
        success: true,
        geojson
      }, {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=600',
        }
      })
    } catch (error) {
      console.error('[wilayah-geojson] Gagal membaca geojson provinsi:', error)
      return NextResponse.json({
        success: false,
        message: 'Gagal memuat GeoJSON provinsi lokal.'
      }, { status: 500 })
    }
  }

  // Fallback for kabupaten/other: return empty FeatureCollection to prevent client-side errors
  return NextResponse.json({
    success: true,
    geojson: {
      type: 'FeatureCollection',
      features: []
    }
  }, { status: 200 })
}
