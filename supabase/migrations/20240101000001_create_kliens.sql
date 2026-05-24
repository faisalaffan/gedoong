-- ============================================================
-- Migration: 001 - Create kliens table
-- Tabel untuk menyimpan data klien (prospek properti)
-- ============================================================

-- Enum types untuk klien
CREATE TYPE pipeline_stage AS ENUM ('Prospek', 'Follow-up', 'Nego', 'Closing', 'Deal');
CREATE TYPE klien_tipe AS ENUM ('Pembeli', 'Penyewa', 'Investor');
CREATE TYPE klien_sumber AS ENUM ('Referral', 'OLX', 'Website', 'Cold Call', 'Lainnya');

-- Tabel kliens
CREATE TABLE IF NOT EXISTS public.kliens (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Data utama
  nama        TEXT NOT NULL,
  kontak      TEXT NOT NULL DEFAULT '',
  properti    TEXT NOT NULL DEFAULT '',
  pipeline    pipeline_stage NOT NULL DEFAULT 'Prospek',
  catatan     TEXT,
  foto_url    TEXT,
  harga       TEXT,
  "order"     INTEGER NOT NULL DEFAULT 0,

  -- Data CRM tambahan
  email           TEXT,
  sumber_klien    klien_sumber NOT NULL DEFAULT 'Referral',
  tipe_klien      klien_tipe NOT NULL DEFAULT 'Pembeli',
  catatan_aktivitas JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Index untuk performa query
CREATE INDEX idx_kliens_pipeline    ON public.kliens (pipeline);
CREATE INDEX idx_kliens_created_at  ON public.kliens (created_at DESC);
CREATE INDEX idx_kliens_order       ON public.kliens ("order");
CREATE INDEX idx_kliens_nama        ON public.kliens USING gin (to_tsvector('indonesian', nama));

-- Enable Row Level Security
ALTER TABLE public.kliens ENABLE ROW LEVEL SECURITY;

-- RLS Policies - semua user authenticated bisa akses data mereka
-- (sesuaikan sesuai kebutuhan multi-tenant jika diperlukan)
CREATE POLICY "Allow authenticated read" ON public.kliens
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert" ON public.kliens
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON public.kliens
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON public.kliens
  FOR DELETE TO authenticated USING (true);

-- Comment dokumentasi
COMMENT ON TABLE  public.kliens IS 'Data klien/prospek untuk CRM properti';
COMMENT ON COLUMN public.kliens.pipeline IS 'Tahap pipeline: Prospek → Follow-up → Nego → Closing → Deal';
COMMENT ON COLUMN public.kliens.catatan_aktivitas IS 'Log aktivitas dalam format JSON [{timestamp, content}]';
COMMENT ON COLUMN public.kliens."order" IS 'Urutan tampilan dalam board/kanban view';
