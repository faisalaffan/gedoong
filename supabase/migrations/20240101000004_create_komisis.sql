-- ============================================================
-- Migration: 004 - Create komisis table
-- Tabel untuk menyimpan data komisi agen properti
-- ============================================================

-- Enum types untuk komisi
CREATE TYPE komisi_status AS ENUM ('Pending', 'Diproses', 'Dibayar');
CREATE TYPE metode_bayar  AS ENUM ('Transfer', 'Cash', 'Cek', 'Lainnya');

-- Tabel komisis
CREATE TABLE IF NOT EXISTS public.komisis (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Relasi ke tabel lain (nullable)
  klien_id    BIGINT REFERENCES public.kliens (id) ON DELETE SET NULL,
  deal_id     BIGINT REFERENCES public.deals  (id) ON DELETE SET NULL,

  -- Data utama (legacy fields)
  properti    TEXT NOT NULL DEFAULT '',
  komisi      NUMERIC(18, 2) NOT NULL DEFAULT 0,  -- Nilai komisi dalam Rupiah
  tanggal     DATE NOT NULL DEFAULT CURRENT_DATE,  -- Tanggal pencatatan (legacy)
  status      komisi_status NOT NULL DEFAULT 'Pending',

  -- Data komisi detail
  komisi_persen   NUMERIC(5, 2),       -- Persentase komisi (misal: 2.5 = 2.5%)
  tanggal_deal    DATE,
  tanggal_bayar   DATE,
  metode_bayar    metode_bayar,
  catatan         TEXT
);

-- Index untuk performa query
CREATE INDEX idx_komisis_status      ON public.komisis (status);
CREATE INDEX idx_komisis_klien_id    ON public.komisis (klien_id);
CREATE INDEX idx_komisis_deal_id     ON public.komisis (deal_id);
CREATE INDEX idx_komisis_created_at  ON public.komisis (created_at DESC);
CREATE INDEX idx_komisis_tanggal     ON public.komisis (tanggal DESC);

-- Enable Row Level Security
ALTER TABLE public.komisis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read" ON public.komisis
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert" ON public.komisis
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON public.komisis
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON public.komisis
  FOR DELETE TO authenticated USING (true);

-- Comment dokumentasi
COMMENT ON TABLE  public.komisis IS 'Data komisi agen dari transaksi properti';
COMMENT ON COLUMN public.komisis.komisi IS 'Nilai komisi dalam Rupiah (IDR)';
COMMENT ON COLUMN public.komisis.komisi_persen IS 'Persentase komisi (misal: 2.5 = 2.5%)';
COMMENT ON COLUMN public.komisis.tanggal IS 'Tanggal pencatatan legacy - gunakan tanggal_deal untuk data baru';
