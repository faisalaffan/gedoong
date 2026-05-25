-- ============================================================
-- Migration: 006 - Create activities table
-- Tabel untuk menyimpan log aktivitas user/agen secara global
-- ============================================================

CREATE TABLE IF NOT EXISTS public.activities (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  description TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated actions
CREATE POLICY "Allow authenticated read" ON public.activities
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert" ON public.activities
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON public.activities
  FOR DELETE TO authenticated USING (true);

-- Comment dokumentasi
COMMENT ON TABLE public.activities IS 'Log audit/aktivitas agen CRM Gedoong';
