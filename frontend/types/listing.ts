export interface Listing {
  id?: number
  created_at?: string
  properti: string
  tipe: 'Jual' | 'Sewa'
  harga: number
  status: 'Aktif' | 'Terjual' | 'Draft'
  lokasi?: string
  kamar_tidur?: number
  kamar_mandi?: number
  luas?: number
  image_url?: string

  // 📍 Lokasi & Alamat
  alamat_lengkap?: string
  kelurahan?: string
  kecamatan?: string
  kota?: string
  provinsi?: string
  kode_pos?: string
  latitude?: number
  longitude?: number
  akses_jalan?: string

  // 🏠 Detail Fisik
  tipe_properti?: string
  kondisi?: string
  lantai?: number
  lantai_ke?: number
  luas_tanah?: number
  hadap?: string
  daya_listrik?: string
  sumber_air?: string
  garasi_carport?: number

  // 💰 Finansial Tambahan
  periode_sewa?: string
  harga_negotiable?: boolean
  biaya_ipl?: number
  pajak_ditanggung?: string
  sertifikat?: string

  // 🛋️ Fasilitas Dalam
  furnished_status?: string
  ac?: number
  water_heater?: boolean
  dapur?: string
  internet_wifi?: boolean
  keamanan_dalam?: string[]

  // 🏘️ Fasilitas Luar & Lingkungan
  kolam_renang?: boolean
  area_bermain?: boolean
  masjid_mushola?: boolean
  keamanan_24j?: boolean
  nama_kompleks?: string

  // 📋 Administratif
  tersedia_untuk?: string
  min_masa_sewa?: number
  tanggal_tersedia?: string
  virtual_tour_url?: string
  deskripsi?: string
  tags?: string[]

  // 📸 Media
  image_urls?: string[]
  video_url?: string
  floor_plan_url?: string
}

export interface ImageFileItem {
  id: string
  file?: File
  url: string
}

export interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error'
}

export type ListingTipe = 'Jual' | 'Sewa'
export type ListingStatus = 'Aktif' | 'Terjual' | 'Draft'

export const TABS_SEQUENCE = ['umum', 'lokasi', 'fisik', 'fasilitas', 'media'] as const
export type TabName = (typeof TABS_SEQUENCE)[number]
