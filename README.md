# Gedoong

SaaS B2B CRM untuk agen properti independen di Indonesia. Listing management, pipeline klien, komisi tracking, dan dokumen templating — semua dalam satu tools ringan.

[![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)](https://go.dev/)
[![Nuxt](https://img.shields.io/badge/Nuxt-00DC82?style=flat&logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Flutter](https://img.shields.io/badge/Flutter-02569B?style=flat&logo=flutter&logoColor=white)](https://flutter.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Open Core](https://img.shields.io/badge/model-open--core-3da639?style=flat)](docs/OPEN_SOURCE_STRATEGY.md)
[![Status](https://img.shields.io/badge/status-planning-lightgrey)](.)

---

## Model Bisnis

Gedoong menganut **Open Core** — core CRM open source (MIT), add-on premium closed source. Detail: [Open Source Strategy](docs/OPEN_SOURCE_STRATEGY.md).

| Tier | Harga | Fitur |
|---|---|---|
| **Community** | Gratis (self-host) | Auth, listing, pipeline, klien, komisi dasar |
| **Pro** | Rp 99K/bln/agen | + Dokumen templating (AJB/PPJB), multi-agen, PDF export |
| **Business** | Rp 249K/bln/agen | + AI estimasi harga, AI draft kontrak, WhatsApp integration, BPN integration |

---

## Kenapa Gedoong?

Pasar property apps di Indonesia sudah crowded di layer agregator (Rumah123, 99.co, Lamudi) dan proptech transaksional (Pinhome, Mamikos). Tapi **agen properti independen** — yang jumlahnya puluhan ribu di seluruh Indonesia — masih pakai WhatsApp + spreadsheet.

CRM existing (Rex, Rumah123 Pro) masih generik dan tidak mendalam ke workflow agen sehari-hari: dari follow-up klien, tracking komisi, sampai templating dokumen AJB/PPJB.

**Gap inilah yang diisi Gedoong.**

Unique angle: integrasi AI untuk draft kontrak, estimasi harga, dan alert potensi sengketa — sesuatu yang incumbent besar belum prioritaskan karena fokus ke volume listing.

---

## Struktur Monorepo

```
gedoong/
├── backend/
│   └── internal/
│       ├── core/         # OPEN — domain models
│       ├── auth/         # OPEN
│       ├── listing/      # OPEN
│       ├── pipeline/     # OPEN
│       ├── client/       # OPEN
│       ├── commission/   # OPEN (single agent)
│       ├── document/     # CLOSED — addon
│       ├── ai/           # CLOSED — addon
│       └── integration/  # CLOSED — addon
├── frontend/
│   ├── pages/            # OPEN — core Nuxt pages
│   └── addons/           # CLOSED — premium UI
├── mobile/
│   ├── lib/              # OPEN — core Flutter screens
│   └── addons/           # CLOSED — premium screens
└── docs/                 # OPEN — dokumentasi, sprint planning
```

| Layer | Tech | Kenapa |
|---|---|---|
| Backend | Go | Performa, concurrency model pas untuk CRM multi-agen, deploy binary kecil |
| Frontend | Nuxt | SSR/SSG hybrid, ekosistem Vue, auto-imports, deployment ke Vercel/Cloudflare |
| Mobile | Flutter | Cross-platform native (iOS + Android) dari satu codebase, performa tinggi |
| Database | MySQL | Relasional, banyak hosting tersedia di Indonesia (RDS, CloudSQL), cocok untuk CRM |
| Caching | Redis | Session, rate limiting, frequently-accessed listing data |

---

## Fitur Utama

- **Listing Management** — CRUD listing properti, status aktif/terjual/off-market, auto-expire
- **Pipeline Klien** — Kanban-style deal tracker dari prospek → closing
- **Komisi Tracking** — Hitung, split, dan status pencairan komisi antar agen
- **Dokumen Templating** — AJB, PPJB, surat kuasa — isi data, generate PDF
- **AI-Powered Insights** — Estimasi harga dari data transaksi terdekat, alert potensi sengketa, draft kontrak otomatis

---

## Getting Started

> Proyek dalam tahap perencanaan. Struktur direktori dan kode belum tersedia.

```bash
# Clone
git clone https://github.com/faisalaffan/gedoong.git
cd gedoong

# Backend (Go)
cd backend
go run ./cmd/server

# Frontend (Nuxt)
cd frontend
npm run dev

# Mobile (Flutter)
cd mobile
flutter run
```

---

## Roadmap

**Fase 1 — Core CRM (MVP)**
- Backend: auth (JWT), user management, listing CRUD
- Frontend: dashboard agen, form listing, daftar klien
- Mobile: view listing, update status klien

**Fase 2 — Pipeline & Dokumen**
- Pipeline kanban (backend + frontend)
- Komisi tracking engine
- Templating dokumen → PDF generation

**Fase 3 — AI Integration**
- Estimasi harga berbasis data transaksi
- Draft kontrak otomatis (LLM-powered)
- Alert sengketa (integrasi data BPN bila tersedia)

**Fase 4 — Multi-agen & Kolaborasi**
- Tim agen dalam satu agency
- Split komisi otomatis
- Leaderboard & reporting

---

## Risiko & Constraints

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Regulasi properti ketat (PPAT, notaris) | Tidak bisa sentuh transaksi langsung | Fokus ke CRM/tools, bukan marketplace transaksi |
| Agen tech-resistant | Onboarding lambat | UX sesimpel mungkin, onboarding via WhatsApp |
| Data harga tidak transparan | Estimasi AI bias | Mulai dari data manual agen sendiri, bukan scraping |
| B2B sales cycle panjang | Cashflow panjang | Freemium self-serve dulu, baru enterprise sales |

---

## Lisensi

- **Core codebase** (`internal/core`, `auth`, `listing`, `pipeline`, `client`, `commission`, `pages/`, `lib/`): MIT
- **Add-on modules** (`internal/document`, `ai`, `integration`, `addons/`): Proprietary
- **Dokumentasi** (`docs/`): CC BY 4.0
- **Brand** (nama "Gedoong", logo): All rights reserved

Lihat [Open Source Strategy](docs/OPEN_SOURCE_STRATEGY.md) untuk detail lengkap.
