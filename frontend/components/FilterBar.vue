<script setup lang="ts">
const activeType = ref('Semua')
const sort = ref('terbaru')

const types = ['Semua', 'Rumah', 'Apartemen', 'Kost', 'Ruko', 'Tanah']
const sortOptions = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'harga-rendah', label: 'Harga Terendah' },
  { value: 'harga-tinggi', label: 'Harga Tertinggi' },
]
</script>

<template>
  <div class="filter-bar">
    <div class="filter-inner">
      <div class="type-chips">
        <button
          v-for="type in types"
          :key="type"
          class="chip"
          :class="{ active: activeType === type }"
          @click="activeType = type"
        >
          {{ type }}
        </button>
      </div>
      <div class="sort-group">
        <label class="sort-label">Urutkan:</label>
        <select v-model="sort" class="sort-select">
          <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  background: #fff;
  border-bottom: 1px solid #e8ecf1;
  position: sticky;
  top: 64px;
  z-index: 50;
}

.filter-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.type-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  padding: 8px 18px;
  border: 1px solid #d7e2ff;
  border-radius: 20px;
  background: #fff;
  color: #434654;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}

.chip:hover { border-color: #0052CC; color: #0052CC; }

.chip.active {
  background: #0052CC;
  border-color: #0052CC;
  color: #fff;
}

.sort-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label {
  font-size: 13px;
  color: #737685;
  white-space: nowrap;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid #d7e2ff;
  border-radius: 8px;
  font-size: 13px;
  color: #041b3c;
  background: #fff;
  font-family: inherit;
  cursor: pointer;
}

@media (max-width: 768px) {
  .filter-inner { flex-direction: column; gap: 10px; align-items: stretch; }
  .sort-group { justify-content: flex-end; }
}
</style>
