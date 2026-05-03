<script setup lang="ts">
defineProps<{
  image: string
  title: string
  price: string
  location: string
  type: 'Jual' | 'Sewa'
  beds: number
  baths: number
  area: number
  isNew?: boolean
}>()
</script>

<template>
  <article class="card">
    <div class="card-image">
      <img :src="image" :alt="title" loading="lazy" />
      <span v-if="isNew" class="badge-new">Baru!</span>
      <span class="badge-type" :class="type === 'Jual' ? 'jual' : 'sewa'">
        Di{{ type }}
      </span>
    </div>
    <div class="card-body">
      <p class="card-price">{{ price }}</p>
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-location">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737685" stroke-width="2"><path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        {{ location }}
      </p>
      <div class="card-features">
        <span class="feature">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737685" stroke-width="2"><path d="M2 4v16h20V4H2Zm2 14V8h16v10H4Z"/></svg>
          {{ beds }} KT
        </span>
        <span class="feature">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737685" stroke-width="2"><path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"/><path d="M3 7a2 2 0 0 1 2-2h1l1-2h10l1 2h1a2 2 0 0 1 2 2"/></svg>
          {{ baths }} KM
        </span>
        <span class="feature">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737685" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>
          {{ area }} m²
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
}

.card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 8px 28px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-image {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #f1f3ff;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.card:hover .card-image img { transform: scale(1.04); }

.badge-new {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 10px;
  background: #FF6B35;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  border-radius: 6px;
}

.badge-type {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  backdrop-filter: blur(8px);
  color: #fff;
}

.badge-type.jual { background: rgba(0, 82, 204, 0.85); }
.badge-type.sewa { background: rgba(40, 90, 185, 0.85); }

.card-body {
  padding: 16px;
}

.card-price {
  font-size: 18px;
  font-weight: 700;
  color: #003d9b;
  margin-bottom: 4px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #041b3c;
  margin-bottom: 6px;
  line-height: 1.4;
}

.card-location {
  font-size: 13px;
  color: #737685;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
}

.card-features {
  display: flex;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid #f1f3ff;
}

.feature {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #737685;
}
</style>
