-- ============================================================
-- Seed Data: Sample data untuk development & testing
-- JANGAN jalankan di production!
-- ============================================================

-- Sample kliens
INSERT INTO public.kliens (nama, kontak, properti, pipeline, catatan, harga, "order", email, sumber_klien, tipe_klien, catatan_aktivitas)
VALUES
  ('Budi Santoso', '08123456789', 'Rumah di Bintaro', 'Prospek', 'Calon pembeli serius', '1.5 M', 1, 'budi@email.com', 'Referral', 'Pembeli', '[{"timestamp":"2024-01-15T10:00:00Z","content":"Pertama kali dihubungi via WhatsApp"}]'),
  ('Siti Rahayu', '08234567890', 'Apartemen di Sudirman', 'Follow-up', 'Sedang mempertimbangkan 2 unit', '800 JT', 2, 'siti@email.com', 'Website', 'Penyewa', '[{"timestamp":"2024-01-20T14:00:00Z","content":"Sudah lihat unit, tertarik unit lantai 15"}]'),
  ('Ahmad Fauzi', '08345678901', 'Ruko di Kelapa Gading', 'Nego', 'Negosiasi harga sudah 2 kali', '3.2 M', 3, 'ahmad@email.com', 'OLX', 'Investor', '[{"timestamp":"2024-02-01T09:00:00Z","content":"Minta discount 10%"}]'),
  ('Dewi Kusuma', '08456789012', 'Kost di Depok', 'Closing', 'Sedang proses dokumen KPR', '450 JT', 4, 'dewi@email.com', 'Cold Call', 'Pembeli', '[]'),
  ('Reza Pratama', '08567890123', 'Villa di Puncak', 'Deal', 'Deal sudah closing!', '5 M', 5, 'reza@email.com', 'Referral', 'Investor', '[{"timestamp":"2024-02-10T16:00:00Z","content":"Deal! SP3K sudah ditandatangani"}]')
ON CONFLICT DO NOTHING;

-- Sample listings
INSERT INTO public.listings (properti, tipe, harga, status, lokasi, kamar_tidur, kamar_mandi, luas, kota, kecamatan, tipe_properti, kondisi, luas_tanah, sertifikat, furnished_status, deskripsi)
VALUES
  ('Rumah Minimalis Modern 2 Lantai', 'Jual', 1500000000, 'Aktif', 'Bintaro, Tangerang Selatan', 4, 3, 200, 'Tangerang Selatan', 'Pesanggrahan', 'Rumah', 'Baru', 150, 'SHM', 'Full Furnished', 'Rumah minimalis modern 2 lantai di kawasan Bintaro. Dekat dengan stasiun Sudimara dan pusat perbelanjaan.'),
  ('Apartemen Studio Sudirman', 'Sewa', 8000000, 'Aktif', 'Sudirman, Jakarta Pusat', 0, 1, 35, 'Jakarta Pusat', 'Tanah Abang', 'Apartemen', 'Baru', NULL, 'SHSRS', 'Full Furnished', 'Studio apartment strategis di pusat bisnis Sudirman. Cocok untuk ekspatriat dan profesional muda.'),
  ('Ruko 3 Lantai Kelapa Gading', 'Jual', 3200000000, 'Aktif', 'Kelapa Gading, Jakarta Utara', 0, 2, 180, 'Jakarta Utara', 'Kelapa Gading', 'Ruko', 'Bekas', 60, 'HGB', 'Unfurnished', 'Ruko strategis 3 lantai di kawasan bisnis Kelapa Gading. Cocok untuk usaha retail atau kantor.'),
  ('Kost Eksklusif Depok', 'Sewa', 2500000, 'Aktif', 'Margonda, Depok', 1, 1, 20, 'Depok', 'Beji', 'Kost', 'Baru', NULL, NULL, 'Semi Furnished', 'Kost eksklusif dekat UI Depok. Fasilitas AC, WiFi, parkir motor. Cocok untuk mahasiswa/karyawan.'),
  ('Villa Private Puncak', 'Sewa', 15000000, 'Aktif', 'Puncak, Bogor', 5, 4, 400, 'Bogor', 'Cisarua', 'Villa', 'Baru', 1000, 'SHM', 'Full Furnished', 'Villa mewah private di Puncak dengan view pegunungan. Kolam renang private, BBQ area, dan taman luas.')
ON CONFLICT DO NOTHING;

-- Sample deals (referencing kliens dan listings)
INSERT INTO public.deals (klien_id, listing_id, name, properti, harga, stage, "order", tipe_properti, tipe_transaksi, tanggal_masuk, target_closing, sumber_lead, komisi_persen, prioritas)
VALUES
  (1, 1, 'Deal Budi - Rumah Bintaro', 'Rumah Minimalis Modern 2 Lantai Bintaro', 1500000000, 'Follow-up', 1, 'Rumah', 'Jual', '2024-01-15', '2024-03-31', 'Referral', 2.5, 'High'),
  (2, 2, 'Deal Siti - Apt Sudirman', 'Apartemen Studio Sudirman', 8000000, 'Prospek', 2, 'Apartemen', 'Sewa', '2024-01-20', NULL, 'Website', 5.0, 'Medium'),
  (3, 3, 'Deal Ahmad - Ruko KG', 'Ruko 3 Lantai Kelapa Gading', 3200000000, 'Nego', 3, 'Ruko', 'Jual', '2024-02-01', '2024-04-30', 'OLX', 2.0, 'High'),
  (5, 5, 'Deal Reza - Villa Puncak', 'Villa Private Puncak', 5000000000, 'Deal', 4, 'Villa', 'Jual', '2024-01-01', '2024-02-10', 'Referral', 2.0, 'High')
ON CONFLICT DO NOTHING;

-- Sample komisis
INSERT INTO public.komisis (klien_id, deal_id, properti, komisi, tanggal, status, komisi_persen, tanggal_deal, tanggal_bayar, metode_bayar, catatan)
VALUES
  (5, 4, 'Villa Private Puncak', 100000000, '2024-02-10', 'Dibayar', 2.0, '2024-02-10', '2024-02-15', 'Transfer', 'Komisi sudah diterima penuh via transfer BCA'),
  (3, 3, 'Ruko 3 Lantai Kelapa Gading', 64000000, '2024-02-15', 'Diproses', 2.0, '2024-02-15', NULL, NULL, 'Menunggu verifikasi dokumen notaris'),
  (1, 1, 'Rumah Minimalis Modern 2 Lantai Bintaro', 37500000, '2024-01-15', 'Pending', 2.5, NULL, NULL, NULL, 'Deal masih dalam proses negosiasi')
ON CONFLICT DO NOTHING;
