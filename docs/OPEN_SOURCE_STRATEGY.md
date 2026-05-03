# Open Source Strategy

## Filosofi

Gedoong menganut model **Open Core** — core CRM selalu open source (MIT), add-on modules premium dijual sebagai closed-source.

Kenapa open core, bukan fully open source atau fully proprietary:

- **Transparansi** — kode terbuka membangun trust agen properti yang skeptis terhadap software baru
- **Adopsi** — self-host gratis jadi jalur masuk untuk agen independen yang budget terbatas
- **Kontribusi** — komunitas developer Indonesia bisa kontribusi, customisasi, dan audit kode
- **Monetisasi** — fitur premium yang menyelesaikan pain point mahal (dokumen hukum, AI, integrasi BPN) dijual sebagai add-on

---

## Boundary: Open vs Closed

### Open Source (MIT) — Selamanya Gratis

| Module | Cakupan |
|---|---|
| **Auth & User** | Register, login, JWT, role dasar (agen, admin) |
| **Listing** | CRUD listing properti, status aktif/terjual/off-market |
| **Pipeline** | Kanban dasar — prospek, nego, closing |
| **Klien** | Kontak, catatan, riwayat interaksi, link ke listing |
| **Komisi** | Kalkulasi single agen, status pencairan |
| **Notifikasi** | In-app notification dasar |

### Closed Source (Add-on) — Berbayar

| Module | Cakupan | Trigger Monetisasi |
|---|---|---|
| **Dokumen** | Templating AJB, PPJB, surat kuasa, PDF generation | Tahap 1 (100+ agen) |
| **Multi-Agen** | Tim, split komisi, RBAC, audit log | Tahap 1 (100+ agen) |
| **AI Engine** | Estimasi harga, draft kontrak, alert sengketa | Tahap 2 (500+ agen) |
| **Integrasi** | WhatsApp API, BPN API, email automation | Tahap 2 (500+ agen) |
| **Analytics** | Dashboard advanced, custom report, export | Tahap 2 (500+ agen) |
| **Enterprise** | SSO/SAML, white-label, on-premise, dedicated support | Tahap 3 (1000+ agen) |

---

## Module Structure

```
gedoong/
├── backend/internal/
│   ├── core/         # OPEN — domain models, interfaces, base abstractions
│   ├── auth/         # OPEN
│   ├── listing/      # OPEN
│   ├── pipeline/     # OPEN
│   ├── client/       # OPEN
│   ├── commission/   # OPEN (single agent only)
│   ├── document/     # CLOSED — addon
│   ├── ai/           # CLOSED — addon
│   └── integration/  # CLOSED — addon
├── frontend/
│   ├── pages/        # OPEN — core dashboard
│   └── addons/       # CLOSED — premium UI components
└── mobile/
    ├── lib/          # OPEN — core screens
    └── addons/       # CLOSED — premium screens
```

Add-on modules di-backend menggunakan **plugin interface pattern**. Core mendefinisikan interface, add-on mengimplementasikan. License key system memvalidasi akses ke add-on.

```go
// backend/internal/core/plugin.go
type DocumentPlugin interface {
    GenerateTemplate(ctx context.Context, docType string, data map[string]any) (*Document, error)
}

type AIPlugin interface {
    EstimatePrice(ctx context.Context, listingID string) (*PriceEstimate, error)
}
```

---

## Tahapan Monetisasi

### Tahap 0: Build (Sekarang — 0 user)

- Semua development open source di repo publik
- Fokus: bangun core CRM yang usable
- Mulai bangun awareness (Twitter, forum properti, komunitas Go/Flutter)
- Tidak generate revenue

### Tahap 1: Traction (~100+ agen aktif)

- **Trigger**: 100 agen terdaftar, 50+ DAU
- **Action**: Soft-launch add-on Dokumen + Multi-Agen
- **Harga**: Rp 99.000/bulan/agen (early adopter)
- **Target revenue**: Menutup biaya infra

### Tahap 2: Revenue (~500+ agen)

- **Trigger**: 500 agen terdaftar, ada konversi ke paid
- **Action**: Launch AI Engine + Integrasi
- **Harga**: Rp 149.000–299.000/bulan (tiered)
- **Target revenue**: Sustainable solo/founder

### Tahap 3: Scale (~1000+ agen)

- **Trigger**: 1000+ agen, recurring revenue stabil
- **Action**: Enterprise tier, white-label untuk agency besar
- **Harga**: Custom pricing
- **Target revenue**: Bisa hire team

---

## Lisensi

| Aset | Lisensi |
|---|---|
| Core codebase (`internal/core`, `auth`, `listing`, `pipeline`, `client`, `commission`) | MIT |
| Add-on modules (`internal/document`, `ai`, `integration`) | Proprietary |
| Frontend core (`pages/`) | MIT |
| Frontend addons (`addons/`) | Proprietary |
| Mobile core (`lib/`) | MIT |
| Mobile addons (`addons/`) | Proprietary |
| Dokumentasi (`docs/`) | CC BY 4.0 |
| Brand assets (logo, nama Gedoong) | Trademark — all rights reserved |

---

## Referensi

Model open-core yang jadi inspirasi:

- [GitLab](https://about.gitlab.com/company/pricing/) — open-core, enterprise features closed
- [Metabase](https://www.metabase.com/pricing/) — open-core + addon modules
- [PostHog](https://posthog.com/pricing) — open-core, scaling features closed
- [Supabase](https://supabase.com/pricing) — open-core, hosting platform closed
