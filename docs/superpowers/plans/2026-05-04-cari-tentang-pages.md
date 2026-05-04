# Halaman Cari Properti & Tentang — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Melengkapi navigasi publik dengan halaman `/cari` (pencarian + filter) dan `/tentang` (statis), plus ekstraksi data listing ke shared module.

**Architecture:** Dua halaman Nuxt baru reuse komponen existing (SearchHero, FilterBar, ListingCard). Data listing diekstrak ke `data/listings.ts`. FilterBar diberi emit untuk filter change. Semua client-side, tanpa backend.

**Tech Stack:** Nuxt 3, Vue 3 Composition API, TypeScript

---

### Task 1: Tipe dan Data Shared

**Files:**
- Create: `frontend/types/listing.ts`
- Create: `frontend/data/listings.ts`

- [ ] **Step 1: Buat interface Listing**

Tulis `frontend/types/listing.ts`:

```ts
export interface Listing {
  image: string
  title: string
  price: string
  location: string
  type: 'Jual' | 'Sewa'
  beds: number
  baths: number
  area: number
  isNew?: boolean
}
```

- [ ] **Step 2: Buat data 18 listing**

Tulis `frontend/data/listings.ts` — 18 listing (6 existing dari index + 12 baru):

```ts
import type { Listing } from '~/types/listing'

export const listings: Listing[] = [
  {
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=340&fit=crop',
    title: 'Rumah Minimalis Modern di BSD',
    price: 'Rp 1.850.000.000',
    location: 'BSD City, Tangerang Selatan',
    type: 'Jual',
    beds: 4,
    baths: 3,
    area: 180,
    isNew: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=340&fit=crop',
    title: 'Apartemen Studio Fully Furnished',
    price: 'Rp 45.000.000 / thn',
    location: 'Kuningan, Jakarta Selatan',
    type: 'Sewa',
    beds: 1,
    baths: 1,
    area: 35,
  },
  {
    image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=340&fit=crop',
    title: 'Ruko Strategis Pinggir Jalan Utama',
    price: 'Rp 3.200.000.000',
    location: 'Surabaya Barat, Surabaya',
    type: 'Jual',
    beds: 2,
    baths: 2,
    area: 250,
  },
  {
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=340&fit=crop',
    title: 'Kost Eksklusif Dekat Kampus UI',
    price: 'Rp 2.500.000 / bln',
    location: 'Beji, Depok',
    type: 'Sewa',
    beds: 1,
    baths: 1,
    area: 20,
    isNew: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=340&fit=crop',
    title: 'Villa Mewah Pemandangan Gunung',
    price: 'Rp 5.800.000.000',
    location: 'Puncak, Bogor',
    type: 'Jual',
    beds: 5,
    baths: 4,
    area: 400,
  },
  {
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=340&fit=crop',
    title: 'Apartemen 2BR City Center',
    price: 'Rp 65.000.000 / thn',
    location: 'Sudirman, Jakarta Pusat',
    type: 'Sewa',
    beds: 2,
    baths: 1,
    area: 55,
  },
  {
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=340&fit=crop',
    title: 'Rumah Cluster Premium Alam Sutera',
    price: 'Rp 2.100.000.000',
    location: 'Alam Sutera, Tangerang',
    type: 'Jual',
    beds: 3,
    baths: 2,
    area: 150,
    isNew: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1600566753086-00f18f6b0050?w=600&h=340&fit=crop',
    title: 'Kost Modern Strategis Dekat Binus',
    price: 'Rp 1.800.000 / bln',
    location: 'Kemanggisan, Jakarta Barat',
    type: 'Sewa',
    beds: 1,
    baths: 1,
    area: 16,
  },
  {
    image: 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=600&h=340&fit=crop',
    title: 'Apartemen 3BR Premium Menteng',
    price: 'Rp 3.500.000.000',
    location: 'Menteng, Jakarta Pusat',
    type: 'Jual',
    beds: 3,
    baths: 2,
    area: 120,
  },
  {
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=340&fit=crop',
    title: 'Rumah Hook Taman Cibubur',
    price: 'Rp 1.200.000.000',
    location: 'Cibubur, Jakarta Timur',
    type: 'Jual',
    beds: 3,
    baths: 2,
    area: 130,
  },
  {
    image: 'https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=600&h=340&fit=crop',
    title: 'Apartemen Studio Green Bay',
    price: 'Rp 35.000.000 / thn',
    location: 'Pluit, Jakarta Utara',
    type: 'Sewa',
    beds: 1,
    baths: 1,
    area: 28,
    isNew: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&h=340&fit=crop',
    title: 'Ruko 3 Lantai Pusat Bisnis',
    price: 'Rp 4.500.000.000',
    location: 'Kelapa Gading, Jakarta Utara',
    type: 'Jual',
    beds: 0,
    baths: 2,
    area: 300,
  },
  {
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=340&fit=crop',
    title: 'Townhouse Minimalis 2 Lantai',
    price: 'Rp 950.000.000',
    location: 'Cimahi, Bandung',
    type: 'Jual',
    beds: 2,
    baths: 2,
    area: 90,
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=340&fit=crop',
    title: 'Kost Putri Eksklusif Dekat UI',
    price: 'Rp 3.000.000 / bln',
    location: 'Beji, Depok',
    type: 'Sewa',
    beds: 1,
    baths: 1,
    area: 22,
    isNew: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=340&fit=crop',
    title: 'Gudang Industri Strategis',
    price: 'Rp 6.200.000.000',
    location: 'Cikarang, Bekasi',
    type: 'Jual',
    beds: 0,
    baths: 1,
    area: 800,
  },
  {
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=340&fit=crop',
    title: 'Apartemen 1BR Taman Anggrek',
    price: 'Rp 55.000.000 / thn',
    location: 'Grogol, Jakarta Barat',
    type: 'Sewa',
    beds: 1,
    baths: 1,
    area: 40,
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=340&fit=crop',
    title: 'Rumah Tua Potensial Renovasi',
    price: 'Rp 750.000.000',
    location: 'Menteng, Jakarta Pusat',
    type: 'Jual',
    beds: 3,
    baths: 2,
    area: 200,
  },
  {
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=340&fit=crop',
    title: 'Tanah Kavling Siap Bangun',
    price: 'Rp 500.000.000',
    location: 'Ciputat, Tangerang Selatan',
    type: 'Jual',
    beds: 0,
    baths: 0,
    area: 120,
    isNew: true,
  },
]

/** Ambil 6 listing pertama untuk halaman Beranda (Properti Pilihan) */
export const featuredListings: Listing[] = listings.slice(0, 6)
```

- [ ] **Step 3: Commit**

```bash
git add frontend/types/listing.ts frontend/data/listings.ts
git commit -m "feat: add shared Listing type and 18 hardcoded listings"
```

---

### Task 2: Edit FilterBar — Tambah Emit

**Files:**
- Modify: `frontend/components/FilterBar.vue`

- [ ] **Step 1: Tambah emits untuk type dan sort changes**

Edit `frontend/components/FilterBar.vue`, ganti `<script setup>` block:

```vue
<script setup lang="ts">
const activeType = ref('Semua')
const sort = ref('terbaru')

const types = ['Semua', 'Jual', 'Sewa']
const sortOptions = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'harga-rendah', label: 'Harga Terendah' },
  { value: 'harga-tinggi', label: 'Harga Tertinggi' },
]

const emit = defineEmits<{
  'update:type': [value: string]
  'update:sort': [value: string]
}>()

function onTypeChange(type: string) {
  activeType.value = type
  emit('update:type', type)
}

function onSortChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value
  sort.value = value
  emit('update:sort', value)
}
</script>
```

- [ ] **Step 2: Update template — ganti @click dan v-model dengan handler baru**

Replace baris template FilterBar:

```vue
<template>
  <div class="filter-bar">
    <div class="filter-inner">
      <div class="type-chips">
        <button
          v-for="type in types"
          :key="type"
          class="chip"
          :class="{ active: activeType === type }"
          @click="onTypeChange(type)"
        >
          {{ type }}
        </button>
      </div>
      <div class="sort-group">
        <label class="sort-label">Urutkan:</label>
        <select :value="sort" @change="onSortChange" class="sort-select">
          <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 3: Commit**

```bash
git add frontend/components/FilterBar.vue
git commit -m "feat: add emit events to FilterBar for type and sort changes"
```

---

### Task 3: Edit index.vue — Pakai Shared Data

**Files:**
- Modify: `frontend/pages/index.vue`

- [ ] **Step 1: Ganti data inline dengan import dari shared**

Edit `frontend/pages/index.vue`, ganti `<script setup>` block:

```vue
<script setup lang="ts">
import { featuredListings } from '~/data/listings'
</script>
```

Hapus seluruh array `listings` yang sebelumnya ada di `<script setup>` (6 objek listing). Semua penggunaan `listings` di template diganti ke `featuredListings`.

- [ ] **Step 2: Update template — ganti `listings` jadi `featuredListings`**

Ganti semua referensi `listings` di template:

```vue
<main class="listings-section">
  <div class="listings-header">
    <h2 class="listings-title">Properti Pilihan</h2>
    <p class="listings-count">{{ featuredListings.length }} properti ditemukan</p>
  </div>

  <div class="listings-grid">
    <ListingCard
      v-for="(listing, i) in featuredListings"
      :key="i"
      v-bind="listing"
    />
  </div>
  ...
</main>
```

- [ ] **Step 3: Commit**

```bash
git add frontend/pages/index.vue
git commit -m "refactor: extract index page listings to shared data module"
```

---

### Task 4: Halaman Cari Properti

**Files:**
- Create: `frontend/pages/cari.vue`

- [ ] **Step 1: Buat halaman cari dengan filter client-side + pagination**

Tulis `frontend/pages/cari.vue`:

```vue
<script setup lang="ts">
import { listings } from '~/data/listings'

const searchKeyword = ref('')
const filterType = ref('Semua')
const filterSort = ref('terbaru')
const currentPage = ref(1)
const perPage = 6

const filtered = computed(() => {
  let result = [...listings]

  // Keyword search
  if (searchKeyword.value.trim()) {
    const q = searchKeyword.value.toLowerCase()
    result = result.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q),
    )
  }

  // Type filter
  if (filterType.value !== 'Semua') {
    result = result.filter((l) => l.type === filterType.value)
  }

  // Sort
  if (filterSort.value === 'harga-rendah') {
    result.sort((a, b) => parsePriceValue(a.price) - parsePriceValue(b.price))
  } else if (filterSort.value === 'harga-tinggi') {
    result.sort((a, b) => parsePriceValue(b.price) - parsePriceValue(a.price))
  }

  return result
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage)))

const paginated = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filtered.value.slice(start, start + perPage)
})

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

/** Parse nilai numerik dari string harga untuk sorting */
function parsePriceValue(price: string): number {
  // "Rp 1.850.000.000" -> 1850000000
  // "Rp 45.000.000 / thn" -> 45000000
  // "Rp 2.500.000 / bln" -> 2500000
  const cleaned = price.replace(/[Rp\s.]/g, '').split('/')[0]
  return parseInt(cleaned, 10) || 0
}

// Reset page saat filter berubah
watch([searchKeyword, filterType, filterSort], () => {
  currentPage.value = 1
})

function onFilterTypeChange(type: string) {
  filterType.value = type
}

function onFilterSortChange(sort: string) {
  filterSort.value = sort
}
</script>

<template>
  <div class="cari-page">
    <NavbarPublic />

    <SearchHero />

    <!-- Search bar -->
    <div class="search-section">
      <div class="keyword-search">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#737685" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="Cari properti berdasarkan nama atau lokasi..."
          class="keyword-input"
        />
      </div>
    </div>

    <FilterBar
      @update:type="onFilterTypeChange"
      @update:sort="onFilterSortChange"
    />

    <main class="results-section">
      <div class="results-header">
        <p class="results-count">{{ filtered.length }} properti ditemukan</p>
      </div>

      <div v-if="paginated.length > 0" class="results-grid">
        <ListingCard
          v-for="(listing, i) in paginated"
          :key="i"
          v-bind="listing"
        />
      </div>

      <div v-else class="empty-state">
        <p class="empty-title">Tidak ada properti ditemukan</p>
        <p class="empty-sub">Coba ubah kata kunci atau filter pencarian</p>
      </div>

      <nav v-if="totalPages > 1" class="pagination">
        <button
          class="page-btn"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          ‹
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          class="page-btn"
          :class="{ active: currentPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          ›
        </button>
      </nav>
    </main>

    <FooterPublic />
  </div>
</template>

<style scoped>
.cari-page {
  min-height: 100vh;
  background: #fafaf8;
}

/* Search section */
.search-section {
  max-width: 800px;
  margin: -20px auto 0;
  padding: 0 24px;
  position: relative;
  z-index: 10;
}

.keyword-search {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #d7e2ff;
  border-radius: 12px;
  padding: 0 16px;
  height: 52px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.keyword-input {
  border: none;
  outline: none;
  font-size: 15px;
  color: #041b3c;
  width: 100%;
  font-family: inherit;
  margin-left: 10px;
}

.keyword-input::placeholder { color: #a1a5b0; }

.search-icon { flex-shrink: 0; }

.results-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

.results-header {
  margin-bottom: 24px;
}

.results-count {
  font-size: 14px;
  color: #737685;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.empty-state {
  text-align: center;
  padding: 64px 24px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #434654;
  margin-bottom: 8px;
}

.empty-sub {
  font-size: 14px;
  color: #a1a5b0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 48px;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #d7e2ff;
  border-radius: 8px;
  background: #fff;
  color: #434654;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}

.page-btn:hover:not(:disabled):not(.active) {
  border-color: #0052CC;
  color: #0052CC;
}

.page-btn.active {
  background: #0052CC;
  border-color: #0052CC;
  color: #fff;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

@media (max-width: 1024px) {
  .results-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .results-grid {
    grid-template-columns: 1fr;
  }

  .results-section {
    padding: 24px 16px 48px;
  }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/pages/cari.vue
git commit -m "feat: add Cari Properti page with client-side filter and pagination"
```

---

### Task 5: Halaman Tentang

**Files:**
- Create: `frontend/pages/tentang.vue`

- [ ] **Step 1: Buat halaman Tentang dengan 4 section statis**

Tulis `frontend/pages/tentang.vue`:

```vue
<template>
  <div class="tentang-page">
    <NavbarPublic />

    <!-- Hero -->
    <section class="about-hero">
      <h1 class="about-title">Gedoong: CRM Properti untuk Agen Independen Indonesia</h1>
      <p class="about-sub">
        Platform all-in-one yang membantu agen properti independen mengelola listing, pipeline, klien, dan komisi — dalam satu tempat.
      </p>
    </section>

    <!-- Misi -->
    <section class="about-mission">
      <div class="mission-grid">
        <div class="mission-card">
          <div class="mission-icon">🎯</div>
          <h3>Untuk Agen Independen</h3>
          <p>
            Gedoong dirancang khusus untuk agen properti mandiri yang ingin profesional tanpa ribet. Tidak perlu tim IT, tidak perlu biaya mahal.
          </p>
        </div>
        <div class="mission-card">
          <div class="mission-icon">🚀</div>
          <h3>Dari End-to-End</h3>
          <p>
            Dari listing properti, follow-up klien, transaksi komisi, sampai manajemen dokumen — semua terintegrasi dalam satu dashboard sederhana.
          </p>
        </div>
      </div>
    </section>

    <!-- Fitur -->
    <section class="about-features">
      <h2 class="section-title">Fitur Utama</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🏠</div>
          <h3>Manajemen Listing</h3>
          <p>Kelola semua properti jual dan sewa. Upload foto, atur harga, dan pantau status listing dengan mudah.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📋</div>
          <h3>Pipeline Kanban</h3>
          <p>Visualisasikan prospek klien dari leads ke closing. Drag-and-drop, atur follow-up, tidak ada yang terlewat.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">👥</div>
          <h3>Direktori Klien</h3>
          <p>Simpan data kontak, preferensi, dan riwayat interaksi dengan setiap klien. Bangun hubungan jangka panjang.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💰</div>
          <h3>Komisi & Keuangan</h3>
          <p>Lacak komisi dari setiap transaksi. Pantau pendapatan, buat laporan sederhana, dan kelola cashflow agen.</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="about-cta">
      <h2>Siap Kelola Properti Lebih Profesional?</h2>
      <p>Gabung dengan 2000+ agen yang sudah menggunakan Gedoong</p>
      <div class="cta-buttons">
        <button class="btn-primary-lg">Mulai Gratis Sekarang</button>
        <button class="btn-outline-lg">Hubungi Kami</button>
      </div>
    </section>

    <FooterPublic />
  </div>
</template>

<style scoped>
.tentang-page {
  min-height: 100vh;
  background: #fafaf8;
}

/* Hero */
.about-hero {
  text-align: center;
  padding: 80px 24px 64px;
  background: linear-gradient(135deg, #0052CC 0%, #003d9b 40%, #041b3c 100%);
  color: #fff;
}

.about-title {
  font-size: 36px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  max-width: 700px;
  margin: 0 auto 20px;
}

.about-sub {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Misi */
.about-mission {
  max-width: 1000px;
  margin: 0 auto;
  padding: 64px 24px;
}

.mission-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

.mission-card {
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 16px;
  padding: 32px;
}

.mission-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.mission-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: #041b3c;
  margin-bottom: 8px;
}

.mission-card p {
  font-size: 15px;
  color: #737685;
  line-height: 1.6;
}

/* Fitur */
.about-features {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px 64px;
}

.section-title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #041b3c;
  margin-bottom: 40px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.feature-card {
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 16px;
  padding: 28px;
  transition: box-shadow 0.2s;
}

.feature-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.feature-icon {
  font-size: 28px;
  margin-bottom: 12px;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #041b3c;
  margin-bottom: 6px;
}

.feature-card p {
  font-size: 14px;
  color: #737685;
  line-height: 1.6;
}

/* CTA */
.about-cta {
  text-align: center;
  padding: 64px 24px;
  background: #fff;
  border-top: 1px solid #e8ecf1;
}

.about-cta h2 {
  font-size: 26px;
  font-weight: 700;
  color: #041b3c;
  margin-bottom: 8px;
}

.about-cta p {
  font-size: 15px;
  color: #737685;
  margin-bottom: 28px;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-primary-lg {
  padding: 14px 32px;
  border: none;
  border-radius: 10px;
  background: #0052CC;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}

.btn-primary-lg:hover { background: #003d9b; }

.btn-outline-lg {
  padding: 14px 32px;
  border: 2px solid #0052CC;
  border-radius: 10px;
  background: transparent;
  color: #0052CC;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.btn-outline-lg:hover {
  background: #0052CC;
  color: #fff;
}

@media (max-width: 768px) {
  .about-title { font-size: 26px; }
  .about-sub { font-size: 15px; }

  .mission-grid,
  .features-grid {
    grid-template-columns: 1fr;
  }

  .about-cta h2 { font-size: 22px; }

  .about-mission { padding: 48px 16px; }
  .about-features { padding: 0 16px 48px; }
  .about-cta { padding: 48px 16px; }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/pages/tentang.vue
git commit -m "feat: add Tentang page with hero, mission, features, and CTA sections"
```

---

### Task 6: Build Verification

- [ ] **Step 1: Jalankan dev server dan cek halaman**

```bash
cd frontend && pnpm build
```

Expected: Build sukses tanpa error.

- [ ] **Step 2: Jalankan dev server dan verifikasi navigasi**

```bash
cd frontend && pnpm dev
```

Buka browser:
1. `http://localhost:3000/` — Beranda tetap berfungsi, 6 listing
2. `http://localhost:3000/cari` — Cari properti muncul, 18 listing, filter berfungsi
3. `http://localhost:3000/tentang` — Tentang muncul, 4 section lengkap
4. Klik navigasi dari navbar di semua halaman — navigasi berfungsi tanpa 404

- [ ] **Step 3: Commit jika ada perubahan dari build**

```bash
git add -A
git commit -m "chore: build verification, fix any issues"
```
