# Gedoong

CRM untuk agen properti independen di Indonesia. Listing management, pipeline klien, komisi tracking — tools ringan pengganti WhatsApp + spreadsheet.

[![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)](https://go.dev/)
[![Nuxt](https://img.shields.io/badge/Nuxt-00DC82?style=flat&logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Flutter](https://img.shields.io/badge/Flutter-02569B?style=flat&logo=flutter&logoColor=white)](https://flutter.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat)](LICENSE)
[![Status](https://img.shields.io/badge/status-planning-lightgrey)](.)

---

## Kenapa Gedoong?

Agen properti independen di Indonesia — jumlahnya puluhan ribu — masih mengandalkan WhatsApp dan spreadsheet untuk mengelola listing, klien, dan komisi. CRM existing terlalu generik atau terlalu mahal.

Gedoong dibangun khusus untuk workflow agen properti: dari follow-up klien sampai tracking komisi, dalam satu tools yang ringan dan mudah dipakai.

---

## Model

Gedoong menganut **open core** — codebase inti selalu open source di bawah lisensi MIT. Fitur tambahan tersedia untuk kebutuhan yang lebih advanced.

[Baca strategi open source](docs/OPEN_SOURCE_STRATEGY.md)

---

## Struktur Monorepo

```
gedoong/
├── backend/          # Go — REST API
├── frontend/         # Nuxt — web dashboard
├── mobile/           # Flutter — iOS & Android
└── docs/             # Dokumentasi
```

| Layer | Tech |
|---|---|
| Backend | Go |
| Frontend | Nuxt |
| Mobile | Flutter |
| Database | MySQL |
| Caching | Redis |

---

## Fitur

- **Listing Management** — CRUD listing properti, status aktif/terjual/off-market
- **Pipeline Klien** — Kanban deal tracker dari prospek sampai closing
- **Komisi Tracking** — Kalkulasi dan status pencairan komisi
- **Notifikasi** — In-app + push reminder follow-up

---

## Getting Started

> Proyek dalam tahap perencanaan. Kode belum tersedia.

```bash
git clone https://github.com/faisalaffan/gedoong.git
cd gedoong

# Backend
cd backend && go run ./cmd/server

# Frontend
cd frontend && npm run dev

# Mobile
cd mobile && flutter run
```

---

## Lisensi

Core codebase: [MIT](LICENSE). Dokumentasi: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Lihat [Open Source Strategy](docs/OPEN_SOURCE_STRATEGY.md) untuk detail boundary lisensi.
