<script setup lang="ts">
const location = ref("");
const propertyType = ref("");
const priceRange = ref("");

const emit = defineEmits<{
  search: [
    filters: { location: string; propertyType: string; priceRange: string },
  ];
}>();

function triggerSearch() {
  emit("search", {
    location: location.value,
    propertyType: propertyType.value,
    priceRange: priceRange.value,
  });
}
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
          <svg
            class="search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#737685"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            v-model="location"
            type="text"
            placeholder="Lokasi, kota, atau area..."
            class="search-input"
            @keyup.enter="triggerSearch"
          />
        </div>
        <div class="search-divider"></div>
        <select
          v-model="propertyType"
          class="search-select"
          @change="triggerSearch"
        >
          <option value="">Jual / Sewa</option>
          <option value="jual">Dijual</option>
          <option value="sewa">Disewakan</option>
        </select>
        <div class="search-divider"></div>
        <select
          v-model="priceRange"
          class="search-select"
          @change="triggerSearch"
        >
          <option value="">Harga</option>
          <option value="0-500jt">&lt; Rp 500 Jt</option>
          <option value="500jt-1m">Rp 500 Jt – 1 M</option>
          <option value="1m-3m">Rp 1 M – 3 M</option>
          <option value="3m-5m">Rp 3 M – 5 M</option>
          <option value="5m+">&gt; Rp 5 M</option>
        </select>
        <button class="search-btn" @click="triggerSearch">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          Cari
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding: 120px 24px 100px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 480px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      135deg,
      rgba(11, 28, 48, 0.75) 0%,
      rgba(0, 82, 204, 0.7) 50%,
      rgba(11, 28, 48, 0.85) 100%
    ),
    url("/01_BANNER.png") no-repeat center center;
  background-size: cover;
  clip-path: polygon(0 0, 100% 0, 100% 88%, 0 98%);
  z-index: 0;
  transform: scale(1.02);
  transition: transform 10s ease-out;
}

.hero:hover .hero-bg {
  transform: scale(1);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 860px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
}

.trust-badges {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.badge {
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-full);
  color: #fff;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: 6px;
}

.hero-title {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
  text-shadow: 0 4px 12px rgba(11, 28, 48, 0.3);
}

.hero-sub {
  font-family: var(--font-body);
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 44px;
  line-height: 1.6;
  text-shadow: 0 2px 6px rgba(11, 28, 48, 0.2);
}

.search-box {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 8px;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.search-field {
  flex: 1.2;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
}

.search-icon {
  flex-shrink: 0;
  stroke: var(--primary);
}

.search-input {
  border: none;
  outline: none;
  font-size: 15px;
  color: var(--text-dark);
  width: 100%;
  font-family: var(--font-body);
  background: transparent;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-divider {
  width: 1px;
  height: 32px;
  background: var(--border-light);
  flex-shrink: 0;
}

.search-select {
  flex: 0.8;
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--text-dark);
  background: transparent;
  padding: 0 16px;
  font-family: var(--font-display);
  font-weight: 500;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23737685' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 28px;
  height: 48px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--primary);
  color: #fff;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 4px 12px rgba(0, 82, 204, 0.2);
}

.search-btn:hover {
  background: var(--primary-hover);
  box-shadow: 0 6px 18px rgba(0, 82, 204, 0.3);
  transform: translateY(-1px);
}

.search-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .hero {
    padding: 80px 16px 60px;
    min-height: auto;
  }
  .hero-bg {
    clip-path: polygon(0 0, 100% 0, 100% 92%, 0 98%);
  }
  .hero-title {
    font-size: 32px;
  }
  .hero-sub {
    font-size: 15px;
    margin-bottom: 32px;
  }

  .search-box {
    flex-direction: column;
    height: auto;
    padding: 12px;
    gap: 12px;
    border-radius: var(--radius-md);
  }

  .search-field {
    width: 100%;
    padding: 10px 8px;
  }

  .search-divider {
    display: none;
  }

  .search-select {
    width: 100%;
    padding: 12px 8px;
    border-top: 1px solid var(--border-light);
    background-position: right 8px center;
  }

  .search-btn {
    width: 100%;
    margin: 4px 0 0 0;
  }

  .trust-badges {
    gap: 8px;
  }
  .badge {
    font-size: 12px;
    padding: 6px 14px;
  }
}
</style>
