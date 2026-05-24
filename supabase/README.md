# Supabase Migrations — Gedoong CRM

Folder ini berisi semua SQL migration dan konfigurasi untuk database Supabase Gedoong CRM.

## Struktur

```
supabase/
├── config.toml                  # Konfigurasi Supabase lokal
├── seed.sql                     # Sample data untuk development
└── migrations/
    ├── 20240101000001_create_kliens.sql       # Tabel klien/prospek
    ├── 20240101000002_create_listings.sql     # Tabel listing properti
    ├── 20240101000003_create_deals.sql        # Tabel deal/pipeline
    ├── 20240101000004_create_komisis.sql      # Tabel komisi agen
    └── 20240101000005_storage_and_functions.sql  # Storage bucket & fungsi helper
```

## Skema Database

### `kliens`

Data klien/prospek properti.

- Pipeline: `Prospek → Follow-up → Nego → Closing → Deal`
- Mendukung catatan aktivitas (JSONB)
- Tipe klien: Pembeli, Penyewa, Investor

### `listings`

Listing properti untuk dijual atau disewa.

- Data lokasi lengkap (lat/long, kecamatan, kota, provinsi)
- Detail fisik (luas, lantai, garasi, dll)
- Fasilitas dalam & luar
- Media (multiple images, video, floor plan)

### `deals`

Pipeline transaksi/deal properti.

- Foreign key ke `kliens` dan `listings` (nullable)
- Activity log (JSONB)
- Tracking komisi persen dan prioritas

### `komisis`

Record komisi agen dari setiap transaksi.

- Status: `Pending → Diproses → Dibayar`
- Metode bayar: Transfer, Cash, Cek, Lainnya
- Foreign key ke `kliens` dan `deals`

## Cara Pakai

### Setup Lokal dengan Supabase CLI

```bash
# Install Supabase CLI (jika belum)
brew install supabase/tap/supabase

# Login ke Supabase
supabase login

# Start Supabase lokal
supabase start

# Jalankan migrations
supabase db push

# Load seed data (opsional, untuk development)
supabase db reset --seed
```

### Push ke Remote Supabase

```bash
# Link project ke remote Supabase
supabase link --project-ref <your-project-ref>

# Push semua migrations ke remote
supabase db push
```

### Generate TypeScript Types (setelah apply migrations)

```bash
# Generate types dari schema remote
supabase gen types typescript --project-id <your-project-ref> \
  > frontend/types/database.types.ts
```

## Storage Buckets

| Bucket              | Akses  | Max Size | Tipe File            |
| ------------------- | ------ | -------- | -------------------- |
| `klien-photos`      | Public | 5 MB     | JPEG, PNG, WebP, GIF |
| `listing-images`    | Public | 10 MB    | JPEG, PNG, WebP      |
| `listing-documents` | Public | 20 MB    | JPEG, PNG, WebP, PDF |

## Helper Functions

- `get_total_komisi_bulan(tahun, bulan)` — Total komisi dibayar pada bulan tertentu
- `get_dashboard_summary()` — Ringkasan statistik untuk dashboard
- `set_updated_at()` — Trigger otomatis update kolom `updated_at`

## Row Level Security

Semua tabel menggunakan RLS. Policy default:

- `authenticated` users bisa READ, INSERT, UPDATE, DELETE semua data

> ⚠️ **Untuk production multi-tenant**, update RLS policies agar data dipisah per `auth.uid()`.
