<script setup lang="ts">
import { featuredListings } from '~/data/listings'
</script>

<template>
  <div class="home">
    <NavbarPublic />

    <SearchHero />

    <FilterBar />

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

      <div class="load-more">
        <button class="btn-load">Muat Lebih Banyak</button>
      </div>
    </main>

    <FooterPublic />
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  background: #fafaf8;
}

.listings-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px 64px;
}

.listings-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 28px;
}

.listings-title {
  font-size: 22px;
  font-weight: 700;
  color: #041b3c;
}

.listings-count {
  font-size: 14px;
  color: #737685;
}

.listings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.load-more {
  text-align: center;
  margin-top: 48px;
}

.btn-load {
  padding: 12px 36px;
  border: 2px solid #0052CC;
  border-radius: 10px;
  background: transparent;
  color: #0052CC;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}

.btn-load:hover {
  background: #0052CC;
  color: #fff;
}

@media (max-width: 1024px) {
  .listings-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .listings-grid {
    grid-template-columns: 1fr;
  }

  .listings-section {
    padding: 28px 16px 48px;
  }

  .listings-title { font-size: 18px; }
}
</style>
