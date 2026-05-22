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

export interface Listing {
  id?: number
  properti: string
  tipe: 'Jual' | 'Sewa'
  harga: string
  status: 'Aktif' | 'Terjual' | 'Draft'
  lokasi?: string
  kamarTidur?: number
  kamarMandi?: number
  luas?: number
  imageUrl?: string
}

// Create DB
export const db = new Dexie('GedoongDB') as Dexie & {
  deals: EntityTable<Deal, 'id'>
  kliens: EntityTable<Klien, 'id'>
  komisi: EntityTable<Komisi, 'id'>
  listings: EntityTable<Listing, 'id'>
}

// Define Schema
db.version(3).stores({
  deals: '++id, stage, order', 
  kliens: '++id, pipeline',
  komisi: '++id, status',
  listings: '++id, tipe, status'
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

  const listingsCount = await db.listings.count()
  if (listingsCount === 0) {
    await db.listings.bulkAdd([
      { properti: 'Rumah Minimalis Jaksel', tipe: 'Jual', harga: 'Rp 850jt', status: 'Aktif', lokasi: 'Jakarta Selatan', kamarTidur: 3, kamarMandi: 2, luas: 120, imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=340&fit=crop' },
      { properti: 'Apartemen Greenlake', tipe: 'Sewa', harga: 'Rp 4.5jt/bln', status: 'Terjual', lokasi: 'Jakarta Utara', kamarTidur: 2, kamarMandi: 1, luas: 60, imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=340&fit=crop' },
      { properti: 'Ruko Mangga Dua', tipe: 'Jual', harga: 'Rp 1.2M', status: 'Draft', lokasi: 'Jakarta Pusat', kamarTidur: 0, kamarMandi: 2, luas: 150, imageUrl: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=340&fit=crop' },
      { properti: 'Villa Puncak', tipe: 'Jual', harga: 'Rp 2.5M', status: 'Aktif', lokasi: 'Bogor', kamarTidur: 4, kamarMandi: 3, luas: 300, imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=340&fit=crop' },
      { properti: 'Kost Exclusive Depok', tipe: 'Sewa', harga: 'Rp 2jt/bln', status: 'Aktif', lokasi: 'Depok', kamarTidur: 1, kamarMandi: 1, luas: 20, imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=340&fit=crop' }
    ])
  }
}
