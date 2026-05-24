export type PipelineStage = 'Prospek' | 'Follow-up' | 'Nego' | 'Closing' | 'Deal'

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
}
