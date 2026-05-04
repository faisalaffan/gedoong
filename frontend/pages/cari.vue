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
