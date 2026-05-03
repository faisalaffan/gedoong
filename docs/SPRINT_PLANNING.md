# Sprint Planning

## Ringkasan

| Item | Detail |
|---|---|
| Cadence | 2 minggu per sprint |
| Total Sprint | 20 sprint (10 bulan) |
| Fase | 5 fase (0-4) |
| Target MVP | Sprint 8 (bulan ke-4) — core CRM siap early users |
| Target Monetisasi | Sprint 16 (bulan ke-8) — add-on modules siap dijual |

---

## Fase 0: Foundation

**Goal**: Monorepo scaffolding, infrastructure, database schema

### Sprint 1 — Scaffolding
- Inisialisasi Go module (`go mod init`)
- Inisialisasi Nuxt project (`npx nuxi init`)
- Inisialisasi Flutter project (`flutter create`)
- Docker Compose: MySQL + Redis + backend
- GitHub Actions CI: lint, test, build
- Makefile: `make dev`, `make test`, `make build`

### Sprint 2 — Database & API Skeleton
- MySQL schema design: users, listings, clients, pipeline, commissions
- Migration tooling (golang-migrate)
- Seeder untuk development data
- Go project layout (`cmd/`, `internal/`, `pkg/`)
- API router setup (chi atau echo)
- Health check endpoint

---

## Fase 1: Core CRM MVP

**Goal**: Auth + listing + pipeline — siap early users manual

### Sprint 3 — Auth
- Register (email + password)
- Login → JWT access + refresh token
- Middleware: auth required
- Password hashing (bcrypt)
- Rate limiting login

### Sprint 4 — User Management
- User profile CRUD
- Role: agen, admin
- Update password
- Forgot password flow (email reset)

### Sprint 5 — Listing
- Listing CRUD: judul, deskripsi, harga, lokasi, tipe (jual/sewa), foto
- Status: aktif, terjual, off-market
- Filter & search listing
- Frontend Nuxt: dashboard agen + form listing

### Sprint 6 — Pipeline
- Pipeline stage: prospek → follow-up → nego → closing → deal
- Drag-and-drop antar stage (frontend)
- Deal value & probability
- Activity log per pipeline item

### Sprint 7 — Klien
- Client contact CRUD
- Catatan per klien
- Link klien ke listing + pipeline
- Riwayat interaksi

### Sprint 8 — Komisi Dasar
- Komisi kalkulasi (persentase dari deal value)
- Status: pending, processed, paid
- Riwayat komisi per agen
- integrasi dengan pipeline (auto-create komisi saat deal)

---

## Fase 2: Engagement

**Goal**: Fitur yang bikin agen sticky — pakai setiap hari

### Sprint 9 — Mobile App (Flutter)
- Login + register di mobile
- View listing (list + detail)
- Update status klien
- Quick action: tambah catatan klien

### Sprint 10 — Notifikasi
- In-app notification center
- Push notification (listing expired, follow-up reminder)
- Email notification (opsional)
- Preference: opt-in/out per jenis notifikasi

### Sprint 11 — Dashboard Analytics
- Widget: listing aktif, klien baru, komisi pending
- Grafik: tren klien, tren komisi (bulanan)
- Quick stat card

### Sprint 12 — Export & Backup
- Export listing ke CSV/Excel
- Export klien ke CSV
- Manual backup (download JSON dump)
- Filter & date range untuk export

---

## Fase 3: Premium Add-ons

**Goal**: Module closed-source pertama — mulai monetisasi

### Sprint 13 — Dokumen Templating Engine
- Template engine: variable injection (`{{nama_pembeli}}`, `{{harga}}`, etc.)
- Template: AJB, PPJB, surat kuasa
- CRUD template untuk admin
- Preview sebelum generate

### Sprint 14 — PDF Generation & Tanda Tangan
- Generate PDF dari template
- Digital signature placeholder (integrasi e-meterai nanti)
- Download & share PDF
- Template versioning

### Sprint 15 — Multi-Agen & Tim
- Agency CRUD
- Invite agen ke tim
- Role: owner, admin, member
- Split komisi multi-agen
- Activity log tim

### Sprint 16 — License Key System
- License key generation
- Validasi license (online + offline fallback)
- Tier mapping: pro, business, enterprise
- Add-on activation per license

---

## Fase 4: AI & Integrasi

**Goal**: Differentiator utama vs CRM generic

### Sprint 17 — AI Estimasi Harga
- Model: kumpulkan data transaksi dari agen-agen (anonymized)
- Estimasi harga berdasarkan: lokasi, LT/LB, tipe properti, fasilitas
- Confidence score
- Fallback ke data NJOP + inflasi kalau data transaksi kurang

### Sprint 18 — AI Draft Kontrak
- LLM-powered template filling
- Input: data listing + data klien → draft kontrak
- Review step (highlight bagian yang perlu dicek manual)
- Multi-language: Indonesia / English

### Sprint 19 — WhatsApp Integration
- Auto-reminder follow-up via WhatsApp (Baileys library)
- Template message per stage pipeline
- Log pengiriman + status (sent, read)
- Opt-in per klien

### Sprint 20 — Dashboard Advanced & Reporting
- Custom report builder
- Team performance dashboard
- Revenue projection
- Export ke PDF report

---

## Dependency Graph

```
Fase 0 (S1-S2)  ← tidak ada dependency
    ↓
Fase 1 (S3-S8)  ← butuh foundation (DB, auth)
    ↓
Fase 2 (S9-S12) ← butuh core CRM (listing, pipeline, klien)
    ↓
Fase 3 (S13-S16) ← butuh engagement features + komisi
    ↓
Fase 4 (S17-S20) ← butuh license system + data transaksi
```

---

## Risk Mitigation

| Risk | Dampak | Mitigasi |
|---|---|---|
| Sprint molor (solo dev) | Timeline mundur | Buffer 1 minggu per fase; cut scope, bukan kualitas |
| Tech debt akumulasi | Fase 3-4 lambat | Refactor sprint setiap akhir fase |
| Early user feedback negatif | Kehilangan traksi | Release ke 5-10 user dulu (alpha), iterasi sebelum scale |
| Monetisasi terlalu awal | User kabur | Core selalu gratis; add-on hanya fitur yang jelas high-value |
