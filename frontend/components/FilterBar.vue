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

<style scoped>
.filter-bar {
  background: var(--bg-nav);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-light);
  position: sticky;
  top: 68px;
  z-index: 50;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
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
  padding: 8px 20px;
  border: 1px solid var(--border-slate);
  border-radius: var(--radius-full);
  background: var(--bg-card);
  color: var(--text-medium);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: var(--font-display);
}

.chip:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-light);
}

.chip.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
  box-shadow: 0 4px 12px var(--primary-glow);
}

.sort-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label {
  font-size: 13px;
  color: var(--text-muted);
  font-family: var(--font-body);
  font-weight: 500;
  white-space: nowrap;
}

.sort-select {
  padding: 8px 16px;
  border: 1px solid var(--border-slate);
  border-radius: var(--radius-md);
  font-size: 13px;
  color: var(--text-dark);
  background: var(--bg-card);
  font-family: var(--font-display);
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition: all var(--transition-fast);
}

.sort-select:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.sort-select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-glow);
}

@media (max-width: 768px) {
  .filter-bar {
    top: 68px;
  }
  .filter-inner {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
    padding: 16px;
  }
  .sort-group {
    justify-content: space-between;
  }
}
</style>
