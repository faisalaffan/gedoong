import type { Klien } from './klien'
import type { Deal } from './deal'

export type KomisiStatus = 'Pending' | 'Diproses' | 'Dibayar'
export type MetodeBayar = 'Transfer' | 'Cash' | 'Cek' | 'Lainnya'

export interface Komisi {
  id?: number
  created_at?: string
  properti: string
  komisi: number // Storing numerical value e.g. 17000000
  tanggal: string // Legacy field
  status: KomisiStatus
  
  // New relational & detail fields
  klien_id?: number
  deal_id?: number
  komisi_persen?: number
  tanggal_deal?: string
  tanggal_bayar?: string
  metode_bayar?: MetodeBayar
  catatan?: string
  
  // Joined relation models
  klien?: Klien
  deal?: Deal
}
