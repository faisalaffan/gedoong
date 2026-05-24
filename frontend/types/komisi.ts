export type KomisiStatus = 'Pending' | 'Diproses' | 'Dibayar'

export interface Komisi {
  id?: number
  created_at?: string
  properti: string
  komisi: number // Storing numerical value e.g. 17000000
  tanggal: string // Format: YYYY-MM-DD
  status: KomisiStatus
}
