import type { Klien } from './klien'
import type { Listing } from './listing'

export interface ActivityLogItem {
  timestamp: string
  action: string
}

export interface Deal {
  id?: number
  created_at?: string
  klien_id: number | null
  listing_id: number | null
  name: string
  properti: string
  harga: number
  stage: 'Prospek' | 'Follow-up' | 'Nego' | 'Closing' | 'Deal'
  order: number
  deskripsi?: string
  tipe_properti?: 'Rumah' | 'Ruko' | 'Apartemen' | 'Kost' | 'Villa'
  tipe_transaksi?: 'Jual' | 'Sewa'
  tanggal_masuk?: string
  target_closing?: string | null
  sumber_lead?: string
  komisi_persen?: number
  prioritas?: 'Low' | 'Medium' | 'High'
  tags?: string[]
  activity_log?: ActivityLogItem[]

  // Relation objects loaded from Supabase joins
  klien?: Klien
  listing?: Listing
}
