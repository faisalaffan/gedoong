<script setup lang="ts">
const location = ref('')
const propertyType = ref('')
const priceRange = ref('')
</script>

<template>
  <section class="hero">
    <div class="hero-bg"></div>
    <div class="hero-content">
      <div class="trust-badges">
        <span class="badge">🏆 5000+ Properti</span>
        <span class="badge">🤝 2000+ Agen</span>
        <span class="badge">📍 50+ Kota</span>
      </div>
      <h1 class="hero-title">Temukan Rumah Impian Anda</h1>
      <p class="hero-sub">
        Jelajahi ribuan properti dari agen terpercaya di seluruh Indonesia
      </p>

      <div class="search-box">
        <div class="search-field">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#737685" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input v-model="location" type="text" placeholder="Lokasi, kota, atau area..." class="search-input" />
        </div>
        <div class="search-divider"></div>
        <select v-model="propertyType" class="search-select">
          <option value="">Jual / Sewa</option>
          <option value="jual">Dijual</option>
          <option value="sewa">Disewakan</option>
        </select>
        <div class="search-divider"></div>
        <select v-model="priceRange" class="search-select">
          <option value="">Harga</option>
          <option value="0-500jt">&lt; Rp 500 Jt</option>
          <option value="500jt-1m">Rp 500 Jt – 1 M</option>
          <option value="1m-3m">Rp 1 M – 3 M</option>
          <option value="3m-5m">Rp 3 M – 5 M</option>
          <option value="5m+">&gt; Rp 5 M</option>
        </select>
        <button class="search-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          Cari
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding: 80px 24px 64px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, #0052CC 0%, #003d9b 40%, #041b3c 100%);
  clip-path: polygon(0 0, 100% 0, 100% 72%, 0 92%);
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.trust-badges {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.badge {
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
}

.hero-title {
  font-size: 44px;
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
}

.hero-sub {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
  line-height: 1.6;
}

.search-box {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  height: 60px;
}

.search-field {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 10px;
}

.search-icon { flex-shrink: 0; }

.search-input {
  border: none;
  outline: none;
  font-size: 15px;
  color: #041b3c;
  width: 100%;
  font-family: inherit;
}

.search-input::placeholder { color: #a1a5b0; }

.search-divider {
  width: 1px;
  height: 28px;
  background: #e8ecf1;
  flex-shrink: 0;
}

.search-select {
  border: none;
  outline: none;
  font-size: 14px;
  color: #041b3c;
  background: transparent;
  padding: 0 16px;
  font-family: inherit;
  cursor: pointer;
  appearance: auto;
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 28px;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: #0052CC;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 6px;
  transition: background 0.15s;
  font-family: inherit;
}

.search-btn:hover { background: #003d9b; }

@media (max-width: 768px) {
  .hero { padding: 48px 16px 40px; }
  .hero-title { font-size: 30px; }
  .hero-sub { font-size: 15px; }

  .search-box {
    flex-direction: column;
    height: auto;
    padding: 12px;
  }

  .search-field { width: 100%; padding: 10px 12px; }
  .search-divider { display: none; }
  .search-select { width: 100%; padding: 10px 12px; border-top: 1px solid #e8ecf1; }
  .search-btn { width: calc(100% - 12px); margin: 8px 6px 6px; justify-content: center; }

  .trust-badges { gap: 8px; }
  .badge { font-size: 12px; padding: 4px 12px; }
}
</style>
