# Spec: Halaman Cari Properti & Tentang

**Tanggal**: 2026-05-04
**Status**: Approved
**Scope**: Frontend Nuxt 3 — dua halaman publik baru + ekstraksi shared data

## Ringkasan

Menambahkan halaman `pages/cari.vue` dan `pages/tentang.vue` untuk melengkapi navigasi publik Gedoong. Saat ini hanya `pages/index.vue` yang ada, sedangkan navbar sudah menautkan ke `/cari` dan `/tentang` (404).

## Halaman Cari Properti (`/cari`)

### Layout

Reuse 3 komponen existing: SearchHero, FilterBar, ListingCard. Struktur:

```
SearchHero (search bar + headline)
FilterBar  (tipe, harga, lokasi, sort)
Hasil      ("N properti ditemukan")
Grid       (ListingCard, 3 kolom desktop → 2 tablet → 1 mobile)
Pagination (numeric: « 1 2 3 »)
```

### Data

- 18 listing hardcoded di `data/listings.ts`, tipe dari `types/listing.ts`
- Halaman index dan cari share data source yang sama
- Data index.vue dipindahkan ke file shared, bukan dihapus

### Filter (Client-Side)

- **Keyword search**: filter `title` dan `location` mengandung keyword
- **Tipe**: Semua / Jual / Sewa
- **Range harga**: dari nilai minimum ke maksimum (slider atau dropdown range)
- **Sort**: Default / Harga Terendah / Harga Tertinggi / Terbaru
- Semua filter sebagai `computed` — tidak ada API call

### Pagination

- 6 item per halaman (3 halaman untuk 18 listing)
- Navigasi numerik + prev/next

## Halaman Tentang (`/tentang`)

### Section (atas ke bawah)

1. **Hero** — headline "Gedoong: CRM Properti untuk Agen Independen Indonesia" + subtext
2. **Misi** — grid 2 kolom: siapa target user + apa yang Gedoong tawarkan
3. **Fitur** — grid 2x2 dengan icon: Manajemen Listing, Pipeline Kanban, Direktori Klien, Komisi & Keuangan
4. **CTA** — dua tombol: "Mulai Gratis Sekarang" + "Hubungi Kami"

Semua konten statis, hardcoded di template. Tidak perlu data source.

## File Structure

```
frontend/
├── types/
│   └── listing.ts          # BARU — interface Listing
├── data/
│   └── listings.ts          # BARU — 18 listing hardcoded
├── pages/
│   ├── index.vue            # EDIT — import data dari shared, bukan inline
│   ├── cari.vue             # BARU — halaman pencarian
│   └── tentang.vue          # BARU — halaman tentang
└── components/
    └── FilterBar.vue        # EDIT — tambah emit untuk filter change events
```

### Tipe Listing

```ts
interface Listing {
  image: string
  title: string
  price: string
  location: string
  type: 'Jual' | 'Sewa'
  beds: number
  baths: number
  area: number
  isNew?: boolean
}
```

## Yang Tidak Dilakukan

- Tidak ada API call atau backend integration
- Tidak ada SSR/async data fetching
- Tidak ada animasi transisi halaman
- FilterBar tidak di-redesign (enhancement minimal: emit event)
- Tentang tidak butuh komponen terpisah (inline di page)

## Acceptance Criteria

1. Klik "Cari Properti" di navbar → halaman `/cari` render tanpa error
2. Filter keyword, tipe, dan harga berfungsi — hasil grid berubah sesuai filter
3. Pagination bekerja: halaman 2 menampilkan listing 7-12
4. Klik "Tentang" di navbar → halaman `/tentang` render semua 4 section
5. Halaman Beranda tetap berfungsi normal (data dari shared file)
6. Semua responsif: desktop, tablet, mobile
7. `pnpm build` sukses tanpa error
