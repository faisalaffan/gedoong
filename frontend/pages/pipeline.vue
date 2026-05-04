<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

interface Deal {
  name: string
  properti: string
  harga: string
}

const stages = [
  { label: 'Prospek', count: 5, color: '#0052CC', deals: [
    { name: 'John', properti: 'Rumah Jaksel', harga: 'Rp 850jt' },
    { name: 'Sarah', properti: 'Apt Greenlake', harga: 'Rp 450jt' },
    { name: 'Rina', properti: 'Ruko BSD', harga: 'Rp 1.2M' },
  ]},
  { label: 'Follow-up', count: 3, color: '#e07b00', deals: [
    { name: 'Andi', properti: 'Ruko Mangga Dua', harga: 'Rp 1.2M' },
  ]},
  { label: 'Nego', count: 2, color: '#9333ea', deals: [
    { name: 'Budi', properti: 'Villa Puncak', harga: 'Rp 2.5M' },
  ]},
  { label: 'Closing', count: 1, color: '#dc2626', deals: [
    { name: 'Dewi', properti: 'Kost Depok', harga: 'Rp 2jt/bln' },
  ]},
  { label: 'Deal', count: 8, color: '#16a34a', deals: [] },
]
</script>

<template>
  <div class="pipeline-page">
    <h2 class="page-title">Pipeline Kanban</h2>

    <div class="kanban-board">
      <div
        v-for="stage in stages"
        :key="stage.label"
        class="kanban-column"
      >
        <div class="column-header">
          <span class="column-title">{{ stage.label }}</span>
          <span class="column-count">{{ stage.count }}</span>
        </div>
        <div class="column-body">
          <div
            v-for="(deal, i) in stage.deals"
            :key="i"
            class="deal-card"
            :style="{ borderLeftColor: stage.color }"
          >
            <div class="deal-name">{{ deal.name }}</div>
            <div class="deal-properti">{{ deal.properti }}</div>
            <div class="deal-harga">{{ deal.harga }}</div>
          </div>
          <div v-if="stage.deals.length === 0" class="column-empty">
            Belum ada deal
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pipeline-page {
  max-width: 100%;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #041b3c;
  margin-bottom: 24px;
}

.kanban-board {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  min-height: 500px;
}

.kanban-column {
  background: #f0f2f5;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 14px 10px;
}

.column-title {
  font-size: 12px;
  font-weight: 700;
  color: #434654;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.column-count {
  font-size: 11px;
  font-weight: 600;
  color: #737685;
  background: #fff;
  padding: 2px 8px;
  border-radius: 10px;
}

.column-body {
  padding: 0 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.deal-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  border-left: 3px solid #0052CC;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

.deal-name {
  font-size: 13px;
  font-weight: 700;
  color: #041b3c;
  margin-bottom: 2px;
}

.deal-properti {
  font-size: 12px;
  color: #434654;
  margin-bottom: 2px;
}

.deal-harga {
  font-size: 11px;
  color: #737685;
  font-weight: 500;
}

.column-empty {
  font-size: 12px;
  color: #a1a5b0;
  text-align: center;
  padding: 20px 0;
}

@media (max-width: 1100px) {
  .kanban-board {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 700px) {
  .kanban-board {
    grid-template-columns: 1fr;
  }
}
</style>
