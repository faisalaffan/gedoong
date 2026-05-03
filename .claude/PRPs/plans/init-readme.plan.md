# Plan: Init README.md

## Summary
Buat README.md untuk project `gedoong` — SaaS B2B property CRM untuk agen independen Indonesia. README berisi visi produk, analisis pasar, tech stack, dan arah development berdasarkan market analysis property apps di Indonesia.

## User Story
As a developer/visitor landing on this repo, I want to immediately understand what Gedoong is, why it exists, and how to get started, so that I can decide whether to contribute, use, or follow the project.

## Problem → Solution
Repo kosong tanpa dokumentasi → README.md yang menjelaskan visi, positioning pasar, dan tech stack.

## Metadata
- **Complexity**: Small
- **Source PRD**: N/A
- **PRD Phase**: N/A
- **Estimated Files**: 1

---

## UX Design

### Before
```
┌─────────────────────────────┐
│  (halaman kosong di GitHub) │
│  Tidak ada informasi apa    │
│  pun tentang project ini    │
└─────────────────────────────┘
```

### After
```
┌──────────────────────────────────────┐
│  🏠 Gedoong — Property CRM untuk     │
│  agen independen Indonesia           │
│  -----------------------------------  │
│  Badge: Go, Next.js, status          │
│                                      │
│  ## Kenapa Gedoong?                  │
│  Analisis pasar & gap               │
│                                      │
│  ## Fitur Utama                      │
│  - Listing management               │
│  - Pipeline klien                   │
│  - Komisi tracking                  │
│  - Dokumen templating               │
│                                      │
│  ## Tech Stack                       │
│  - Backend: Go                      │
│  - Frontend: Next.js                │
│                                      │
│  ## Getting Started                  │
│  ...                                 │
│                                      │
│  ## Roadmap                          │
│  ...                                 │
│                                      │
│  ## Risiko & Constraints             │
│  ...                                 │
└──────────────────────────────────────┘
```

### Interaction Changes
| Touchpoint | Before | After | Notes |
|---|---|---|---|
| GitHub repo landing | Empty page | Full README dengan visi & struktur | - |

---

## Mandatory Reading

Tidak ada file existing yang perlu dibaca — repo greenfield.

## External Documentation

| Topic | Source | Key Takeaway |
|---|---|---|
| Standard Go README convention | github.com/standard/readme | Badge, install, quickstart |
| Property market context | User-provided analysis | Positioning vs incumbent |

---

## Patterns to Mirror

Tidak ada code pattern — ini pure markdown documentation.

---

## Files to Change

| File | Action | Justification |
|---|---|---|
| `README.md` | CREATE | Root-level project documentation |

## NOT Building

- Tidak membuat kode aplikasi
- Tidak membuat go.mod
- Tidak membuat struktur folder `cmd/`, `internal/`, `pkg/`
- Tidak membuat PRD, roadmap teknis, atau architecture decision records

---

## Step-by-Step Tasks

### Task 1: Tulis README.md
- **ACTION**: CREATE `README.md` di root repo
- **IMPLEMENT**: Tulis markdown dengan sections:
  1. **Header** — nama project, badge Go/Next.js, tagline singkat
  2. **Kenapa Gedoong?** — rangkuman analisis pasar (crowded aggregator, gap CRM agen independen)
  3. **Fitur Utama** — listing management, pipeline klien, komisi tracking, AJB/PPJB templating, AI-powered insights
  4. **Tech Stack** — Go (backend), Next.js (frontend), PostgreSQL
  5. **Getting Started** — placeholder `TBD — project dalam tahap perencanaan`
  6. **Roadmap** — fase awal: core CRM, integrasi AI untuk draft kontrak
  7. **Risiko & Constraints** — regulasi properti, B2B sales cycle, data akuisisi
- **MIRROR**: N/A — greenfield
- **IMPORTS**: N/A
- **GOTCHA**: Jangan hardcode detail yang akan cepat obsolete (tanggal, versi specific)
- **VALIDATE**: `cat README.md` — pastikan semua section ada dan render dengan benar di markdown preview

---

## Testing Strategy

Tidak ada test — dokumentasi murni.

### Edge Cases Checklist
- [x] Markdown syntax valid (tidak ada broken table, broken link)
- [x] Bahasa konsisten (Indonesia untuk narasi, English untuk technical terms)

---

## Validation Commands

### Markdown Validation
```bash
cat README.md
```
EXPECT: Semua section terisi, tidak ada placeholder kosong

### Git Status
```bash
git status
```
EXPECT: Hanya README.md yang untracked/modified

---

## Acceptance Criteria
- [ ] README.md exists di root repo
- [ ] Semua 7 section terisi
- [ ] Analisis pasar tersampaikan dengan jelas
- [ ] Tech stack disebutkan
- [ ] Tidak ada placeholder `TODO` atau `TBD` kecuali di Getting Started
- [ ] Markdown valid

## Completion Checklist
- [ ] File README.md created
- [ ] Section lengkap dan koheren
- [ ] Bahasa Indonesia konsisten
- [ ] Siap untuk commit

## Risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Konten terlalu panjang untuk README | Medium | Low | Keep concise, link ke dokumen terpisah untuk detail |
| Analisis pasar cepat obsolete | Low | Low | Tulis sebagai "why we exist" bukan "current market snapshot" |

## Notes
- User input adalah analisis pasar property apps Indonesia — ini jadi fondasi narasi "why"
- Fokus ke CRM agen independen (opsi #1 dari analisis), bukan rental management
- Gedoong = nama project (asal dari "gedong" = bangunan dalam bahasa Sunda/Jawa)
