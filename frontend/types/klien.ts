export type PipelineStage = 'Prospek' | 'Follow-up' | 'Nego' | 'Closing' | 'Deal'
export type KlienTipe = 'Pembeli' | 'Penyewa' | 'Investor'
export type KlienSumber = 'Referral' | 'OLX' | 'Website' | 'Cold Call' | 'Lainnya'

export interface AktivitasKlien {
  timestamp: string
  content: string
}

export interface Klien {
  id?: number
  created_at?: string
  nama: string
  kontak: string
  properti: string
  pipeline: PipelineStage
  catatan?: string
  foto_url?: string
  harga?: string
  order?: number
  
  // New CRM columns
  email?: string
  sumber_klien?: KlienSumber
  tipe_klien?: KlienTipe
  catatan_aktivitas?: AktivitasKlien[]
}
