<script setup lang="ts">
const listings = [
  {
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=340&fit=crop',
    title: 'Rumah Minimalis Modern di BSD',
    price: 'Rp 1.850.000.000',
    location: 'BSD City, Tangerang Selatan',
    type: 'Jual' as const,
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
    type: 'Sewa' as const,
    beds: 1,
    baths: 1,
    area: 35,
  },
  {
    image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=340&fit=crop',
    title: 'Ruko Strategis Pinggir Jalan Utama',
    price: 'Rp 3.200.000.000',
    location: 'Surabaya Barat, Surabaya',
    type: 'Jual' as const,
    beds: 2,
    baths: 2,
    area: 250,
  },
  {
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=340&fit=crop',
    title: 'Kost Eksklusif Dekat Kampus UI',
    price: 'Rp 2.500.000 / bln',
    location: 'Beji, Depok',
    type: 'Sewa' as const,
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
    type: 'Jual' as const,
    beds: 5,
    baths: 4,
    area: 400,
  },
  {
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=340&fit=crop',
    title: 'Apartemen 2BR City Center',
    price: 'Rp 65.000.000 / thn',
    location: 'Sudirman, Jakarta Pusat',
    type: 'Sewa' as const,
    beds: 2,
    baths: 1,
    area: 55,
  },
]
</script>

<template>
  <div class="home">
    <NavbarPublic />

    <SearchHero />

    <FilterBar />

    <main class="listings-section">
      <div class="listings-header">
        <h2 class="listings-title">Properti Pilihan</h2>
        <p class="listings-count">{{ listings.length }} properti ditemukan</p>
      </div>

      <div class="listings-grid">
        <ListingCard
          v-for="(listing, i) in listings"
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
