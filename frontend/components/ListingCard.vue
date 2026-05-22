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
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
  transition: all var(--transition-normal);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
}

.card:hover {
  box-shadow: var(--shadow-hover);
  border-color: rgba(0, 82, 204, 0.2);
  transform: translateY(-4px);
}

.card-image {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--primary-light);
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.card:hover .card-image img {
  transform: scale(1.05);
}

.badge-new {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 12px;
  background: var(--accent);
  color: #fff;
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.badge-type {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  box-shadow: var(--shadow-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-type.jual { background: rgba(0, 82, 204, 0.85); }
.badge-type.sewa { background: rgba(20, 184, 166, 0.85); }

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-price {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 6px;
}

.card-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 8px;
  line-height: 1.4;
  transition: color var(--transition-fast);
}

.card:hover .card-title {
  color: var(--primary);
}

.card-location {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  margin-top: auto;
}

.card-location svg {
  stroke: var(--primary);
}

.card-features {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.feature {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--text-medium);
  font-weight: 500;
}

.feature svg {
  stroke: var(--primary);
  opacity: 0.8;
}
</style>
