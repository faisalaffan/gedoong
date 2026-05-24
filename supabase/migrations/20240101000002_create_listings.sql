-- ============================================================
-- Migration: 002 - Create listings table
-- Tabel untuk menyimpan data listing properti
-- ============================================================

-- Enum types untuk listing
CREATE TYPE listing_tipe   AS ENUM ('Jual', 'Sewa');
CREATE TYPE listing_status AS ENUM ('Aktif', 'Terjual', 'Draft');

-- Tabel listings
CREATE TABLE IF NOT EXISTS public.listings (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Data utama
  properti    TEXT NOT NULL,
  tipe        listing_tipe NOT NULL DEFAULT 'Jual',
  harga       NUMERIC(18, 2) NOT NULL DEFAULT 0,
  status      listing_status NOT NULL DEFAULT 'Aktif',
  lokasi      TEXT,
  kamar_tidur INTEGER,
  kamar_mandi INTEGER,
  luas        NUMERIC(10, 2),
  image_url   TEXT,

  -- 📍 Lokasi & Alamat
  alamat_lengkap  TEXT,
  kelurahan       TEXT,
  kecamatan       TEXT,
  kota            TEXT,
  provinsi        TEXT,
  kode_pos        TEXT,
  latitude        DOUBLE PRECISION,
  longitude       DOUBLE PRECISION,
  akses_jalan     TEXT,

  -- 🏠 Detail Fisik
  tipe_properti   TEXT,   -- Rumah, Ruko, Apartemen, Kost, Villa, dll
  kondisi         TEXT,   -- Baru, Bekas, Renovasi
  lantai          INTEGER,
  lantai_ke       INTEGER,
  luas_tanah      NUMERIC(10, 2),
  hadap           TEXT,
  daya_listrik    TEXT,
  sumber_air      TEXT,
  garasi_carport  INTEGER,

  -- 💰 Finansial Tambahan
  periode_sewa        TEXT,
  harga_negotiable    BOOLEAN NOT NULL DEFAULT FALSE,
  biaya_ipl           NUMERIC(12, 2),
  pajak_ditanggung    TEXT,
  sertifikat          TEXT,   -- SHM, HGB, SHSRS, dll

  -- 🛋️ Fasilitas Dalam
  furnished_status    TEXT,   -- Unfurnished, Semi Furnished, Full Furnished
  ac                  INTEGER,
  water_heater        BOOLEAN,
  dapur               TEXT,   -- Ada, Tidak Ada
  internet_wifi       BOOLEAN,
  keamanan_dalam      TEXT[],

  -- 🏘️ Fasilitas Luar & Lingkungan
  kolam_renang    BOOLEAN,
  area_bermain    BOOLEAN,
  masjid_mushola  BOOLEAN,
  keamanan_24j    BOOLEAN,
  nama_kompleks   TEXT,

  -- 📋 Administratif
  tersedia_untuk      TEXT,
  min_masa_sewa       INTEGER,
  tanggal_tersedia    DATE,
  virtual_tour_url    TEXT,
  deskripsi           TEXT,
  tags                TEXT[],

  -- 📸 Media
  image_urls      TEXT[],
  video_url       TEXT,
  floor_plan_url  TEXT
);

-- Index untuk performa query
CREATE INDEX idx_listings_tipe       ON public.listings (tipe);
CREATE INDEX idx_listings_status     ON public.listings (status);
CREATE INDEX idx_listings_kota       ON public.listings (kota);
CREATE INDEX idx_listings_created_at ON public.listings (created_at DESC);
CREATE INDEX idx_listings_harga      ON public.listings (harga);
CREATE INDEX idx_listings_properti   ON public.listings USING gin (to_tsvector('indonesian', properti));

-- Enable Row Level Security
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read" ON public.listings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert" ON public.listings
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON public.listings
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON public.listings
  FOR DELETE TO authenticated USING (true);

-- Comment dokumentasi
COMMENT ON TABLE  public.listings IS 'Data listing properti untuk dijual atau disewa';
COMMENT ON COLUMN public.listings.harga IS 'Harga dalam Rupiah (IDR)';
COMMENT ON COLUMN public.listings.image_urls IS 'Array URL gambar properti';
COMMENT ON COLUMN public.listings.tags IS 'Label/tag tambahan untuk filtering';
