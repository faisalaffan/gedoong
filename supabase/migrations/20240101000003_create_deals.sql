-- ============================================================
-- Migration: 003 - Create deals table
-- Tabel untuk menyimpan data deal/transaksi properti
-- ============================================================

-- Enum types untuk deal
CREATE TYPE deal_stage AS ENUM ('Prospek', 'Follow-up', 'Nego', 'Closing', 'Deal');
CREATE TYPE deal_tipe_properti AS ENUM ('Rumah', 'Ruko', 'Apartemen', 'Kost', 'Villa');
CREATE TYPE deal_tipe_transaksi AS ENUM ('Jual', 'Sewa');
CREATE TYPE deal_prioritas AS ENUM ('Low', 'Medium', 'High');

-- Tabel deals
CREATE TABLE IF NOT EXISTS public.deals (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Relasi ke tabel lain (nullable - boleh standalone)
  klien_id    BIGINT REFERENCES public.kliens (id) ON DELETE SET NULL,
  listing_id  BIGINT REFERENCES public.listings (id) ON DELETE SET NULL,

  -- Data utama
  name        TEXT NOT NULL DEFAULT '',
  properti    TEXT NOT NULL DEFAULT '',
  harga       NUMERIC(18, 2) NOT NULL DEFAULT 0,
  stage       deal_stage NOT NULL DEFAULT 'Prospek',
  "order"     INTEGER NOT NULL DEFAULT 0,
  deskripsi   TEXT,

  -- Detail deal
  tipe_properti   deal_tipe_properti,
  tipe_transaksi  deal_tipe_transaksi,
  tanggal_masuk   DATE,
  target_closing  DATE,
  sumber_lead     TEXT,
  komisi_persen   NUMERIC(5, 2),
  prioritas       deal_prioritas NOT NULL DEFAULT 'Medium',
  tags            TEXT[],
  activity_log    JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Index untuk performa query
CREATE INDEX idx_deals_stage       ON public.deals (stage);
CREATE INDEX idx_deals_klien_id    ON public.deals (klien_id);
CREATE INDEX idx_deals_listing_id  ON public.deals (listing_id);
CREATE INDEX idx_deals_created_at  ON public.deals (created_at DESC);
CREATE INDEX idx_deals_order       ON public.deals ("order");
CREATE INDEX idx_deals_prioritas   ON public.deals (prioritas);

-- Enable Row Level Security
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read" ON public.deals
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert" ON public.deals
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON public.deals
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON public.deals
  FOR DELETE TO authenticated USING (true);

-- Comment dokumentasi
COMMENT ON TABLE  public.deals IS 'Data deal/pipeline transaksi properti';
COMMENT ON COLUMN public.deals.harga IS 'Nilai transaksi/deal dalam Rupiah (IDR)';
COMMENT ON COLUMN public.deals.komisi_persen IS 'Persentase komisi agen (misal: 2.5 = 2.5%)';
COMMENT ON COLUMN public.deals.activity_log IS 'Log aktivitas deal dalam format JSON [{timestamp, action}]';
COMMENT ON COLUMN public.deals."order" IS 'Urutan tampilan dalam pipeline board';
