import Dexie, { type EntityTable } from 'dexie'

export interface Deal {
  id?: number
  name: string
  properti: string
  harga: string
  stage: string
  order: number
  deskripsi?: string
}


export interface Klien {
  id?: number
  nama: string
  kontak: string
  properti: string
  pipeline: string
}

export interface Komisi {
  id?: number
  properti: string
  komisi: string
  tanggal: string
  status: string
}

// Create DB
export const db = new Dexie('GedoongDB') as Dexie & {
  deals: EntityTable<Deal, 'id'>
  kliens: EntityTable<Klien, 'id'>
  komisi: EntityTable<Komisi, 'id'>
}

// Define Schema
db.version(2).stores({
  deals: '++id, stage, order', 
  kliens: '++id, pipeline',
  komisi: '++id, status'
})

// Seed Initial Data
export async function seedDb() {
  const dealsCount = await db.deals.count()
  if (dealsCount === 0) {
    await db.deals.bulkAdd([
      { name: 'John', properti: 'Rumah Jaksel', harga: 'Rp 850jt', stage: 'Prospek', order: 0 },
      { name: 'Sarah', properti: 'Apt Greenlake', harga: 'Rp 450jt', stage: 'Prospek', order: 1 },
      { name: 'Rina', properti: 'Ruko BSD', harga: 'Rp 1.2M', stage: 'Prospek', order: 2 },
      { name: 'Andi', properti: 'Ruko Mangga Dua', harga: 'Rp 1.2M', stage: 'Follow-up', order: 0 },
      { name: 'Budi', properti: 'Villa Puncak', harga: 'Rp 2.5M', stage: 'Nego', order: 0 },
      { name: 'Dewi', properti: 'Kost Depok', harga: 'Rp 2jt/bln', stage: 'Closing', order: 0 },
    ])
  }

  const kliensCount = await db.kliens.count()
  if (kliensCount === 0) {
    await db.kliens.bulkAdd([
      { nama: 'John Doe', kontak: '0812-3456-7890', properti: 'Rumah Minimalis Jaksel', pipeline: 'Prospek' },
      { nama: 'Sarah Lee', kontak: '0856-7890-1234', properti: 'Apartemen Greenlake', pipeline: 'Nego' },
      { nama: 'Andi Prasetyo', kontak: '0878-1234-5678', properti: 'Ruko Mangga Dua', pipeline: 'Follow-up' },
      { nama: 'Rina Wijaya', kontak: '0813-9876-5432', properti: 'Ruko BSD', pipeline: 'Prospek' },
    ])
  }

  const komisiCount = await db.komisi.count()
  if (komisiCount === 0) {
    await db.komisi.bulkAdd([
      { properti: 'Rumah Minimalis Jaksel', komisi: 'Rp 17jt', tanggal: '4 Mei 2026', status: 'Diproses' },
      { properti: 'Apartemen Greenlake', komisi: 'Rp 8jt', tanggal: '28 Apr 2026', status: 'Dibayar' },
      { properti: 'Ruko Mangga Dua', komisi: 'Rp 24jt', tanggal: '15 Apr 2026', status: 'Dibayar' },
      { properti: 'Villa Puncak', komisi: 'Rp 50jt', tanggal: '2 Apr 2026', status: 'Pending' },
    ])
  }
}
