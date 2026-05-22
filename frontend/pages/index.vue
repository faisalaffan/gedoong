<script setup lang="ts">
import { listings } from '~/data/listings'

const visibleCount = ref(6)
const increment = 6

const visibleListings = computed(() => listings.slice(0, visibleCount.value))

function loadMore() {
  visibleCount.value = Math.min(visibleCount.value + increment, listings.length)
}
</script>

<template>
  <div>
    <SearchHero />

    <FilterBar />

    <main class="listings-section">
      <div class="listings-header">
        <h2 class="listings-title">Properti Pilihan</h2>
        <p class="listings-count">{{ visibleListings.length }} dari {{ listings.length }} properti</p>
      </div>

      <div class="listings-grid">
        <ListingCard
          v-for="(listing, i) in visibleListings"
          :key="i"
          v-bind="listing"
        />
      </div>

      <div v-if="visibleCount < listings.length" class="load-more">
        <button class="btn-load" @click="loadMore">Muat Lebih Banyak</button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.listings-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 64px 24px 80px;
}

.listings-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 36px;
  border-bottom: 2px solid var(--border-light);
  padding-bottom: 16px;
}

.listings-title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 800;
  color: var(--text-dark);
  position: relative;
}

.listings-title::after {
  content: '';
  position: absolute;
  bottom: -18px;
  left: 0;
  width: 60px;
  height: 4px;
  background: var(--primary);
  border-radius: var(--radius-full);
}

.listings-count {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 500;
}

.listings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.load-more {
  text-align: center;
  margin-top: 64px;
}

.btn-load {
  padding: 14px 40px;
  border: 2px solid var(--primary);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--primary);
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.btn-load:hover {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 6px 20px rgba(0, 82, 204, 0.25);
  transform: translateY(-1px);
}

.btn-load:active {
  transform: translateY(0);
}

@media (max-width: 1024px) {
  .listings-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (max-width: 640px) {
  .listings-grid {
    grid-template-columns: 1fr;
  }

  .listings-section {
    padding: 40px 16px 60px;
  }

  .listings-title { 
    font-size: 22px; 
  }
  
  .listings-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .listings-title::after {
    bottom: -14px;
  }
}
</style>
