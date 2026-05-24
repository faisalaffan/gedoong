-- ============================================================
-- Migration: 005 - Storage buckets & helper functions
-- Setup storage untuk foto/media properti dan fungsi utilitas
-- ============================================================

-- ─────────────────────────────────────────────
-- Storage Buckets
-- ─────────────────────────────────────────────

-- Bucket untuk foto klien
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'klien-photos',
  'klien-photos',
  true,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Bucket untuk foto listing properti
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-images',
  'listing-images',
  true,
  10485760, -- 10 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Bucket untuk dokumen properti (floor plan, dll)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-documents',
  'listing-documents',
  true,
  20971520, -- 20 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public read klien-photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'klien-photos');

CREATE POLICY "Auth upload klien-photos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'klien-photos');

CREATE POLICY "Auth delete klien-photos" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'klien-photos');

CREATE POLICY "Public read listing-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'listing-images');

CREATE POLICY "Auth upload listing-images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'listing-images');

CREATE POLICY "Auth delete listing-images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'listing-images');

CREATE POLICY "Public read listing-documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'listing-documents');

CREATE POLICY "Auth upload listing-documents" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'listing-documents');

CREATE POLICY "Auth delete listing-documents" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'listing-documents');

-- ─────────────────────────────────────────────
-- Helper Functions
-- ─────────────────────────────────────────────

-- Fungsi untuk menghitung total komisi per bulan
CREATE OR REPLACE FUNCTION public.get_total_komisi_bulan(
  tahun   INT DEFAULT EXTRACT(YEAR FROM NOW())::INT,
  bulan   INT DEFAULT EXTRACT(MONTH FROM NOW())::INT
)
RETURNS NUMERIC
LANGUAGE SQL STABLE
AS $$
  SELECT COALESCE(SUM(komisi), 0)
  FROM   public.komisis
  WHERE  status = 'Dibayar'
    AND  EXTRACT(YEAR  FROM COALESCE(tanggal_bayar, tanggal)) = tahun
    AND  EXTRACT(MONTH FROM COALESCE(tanggal_bayar, tanggal)) = bulan;
$$;

-- Fungsi untuk menghitung ringkasan dashboard
CREATE OR REPLACE FUNCTION public.get_dashboard_summary()
RETURNS TABLE (
  total_kliens      BIGINT,
  total_listings    BIGINT,
  total_deals       BIGINT,
  total_komisi_ytd  NUMERIC,
  deals_closing     BIGINT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    (SELECT COUNT(*) FROM public.kliens)                                          AS total_kliens,
    (SELECT COUNT(*) FROM public.listings WHERE status = 'Aktif')                AS total_listings,
    (SELECT COUNT(*) FROM public.deals)                                           AS total_deals,
    (SELECT COALESCE(SUM(komisi), 0) FROM public.komisis
       WHERE status = 'Dibayar'
         AND EXTRACT(YEAR FROM COALESCE(tanggal_bayar, tanggal)) = EXTRACT(YEAR FROM NOW()))
                                                                                  AS total_komisi_ytd,
    (SELECT COUNT(*) FROM public.deals WHERE stage IN ('Nego', 'Closing'))       AS deals_closing;
$$;

-- Fungsi updated_at otomatis
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ─────────────────────────────────────────────
-- Add updated_at column to all tables
-- ─────────────────────────────────────────────
ALTER TABLE public.kliens   ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.deals    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.komisis  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Trigger updated_at
CREATE TRIGGER trg_kliens_updated_at
  BEFORE UPDATE ON public.kliens
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_deals_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_komisis_updated_at
  BEFORE UPDATE ON public.komisis
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON FUNCTION public.get_total_komisi_bulan IS 'Hitung total komisi yang sudah dibayar pada bulan tertentu';
COMMENT ON FUNCTION public.get_dashboard_summary  IS 'Ringkasan statistik untuk halaman dashboard';
