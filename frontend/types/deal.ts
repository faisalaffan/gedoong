export interface Deal {
  id?: number
  created_at?: string
  name: string
  properti: string
  harga: string
  stage: 'Prospek' | 'Follow-up' | 'Nego' | 'Closing' | 'Deal'
  order: number
  deskripsi?: string
}
