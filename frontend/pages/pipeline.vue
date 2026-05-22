<script setup lang="ts">
import { ref, onMounted } from 'vue'
import draggable from 'vuedraggable'
import { db, seedDb, type Deal } from '~/utils/db'

definePageMeta({ layout: 'dashboard' })

const stageConfigs = [
  { label: 'Prospek', color: '#0052CC' },
  { label: 'Follow-up', color: '#e07b00' },
  { label: 'Nego', color: '#9333ea' },
  { label: 'Closing', color: '#dc2626' },
  { label: 'Deal', color: '#16a34a' },
]

const stages = ref(stageConfigs.map(c => ({ ...c, deals: [] as Deal[] })))

onMounted(async () => {
  await seedDb()
  await loadDeals()
})

async function loadDeals() {
  const allDeals = await db.deals.toArray()
  allDeals.sort((a, b) => (a.order || 0) - (b.order || 0))
  
  stages.value.forEach(stage => {
    stage.deals = allDeals.filter(d => d.stage === stage.label)
  })
}

async function onChange(event: any, stageLabel: string) {
  const stage = stages.value.find(s => s.label === stageLabel)
  if (stage) {
    await db.transaction('rw', db.deals, async () => {
      for (let i = 0; i < stage.deals.length; i++) {
        const deal = stage.deals[i]
        if (deal.id) {
          await db.deals.update(deal.id, { stage: stageLabel, order: i })
        }
      }
    })
  }
}
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
          <span class="column-count">{{ stage.deals.length }}</span>
        </div>
        
        <draggable
          v-model="stage.deals"
          group="kanban-deals"
          item-key="id"
          class="column-body"
          ghost-class="ghost-card"
          animation="200"
          @change="onChange($event, stage.label)"
        >
          <template #item="{ element }">
            <div
              class="deal-card"
              :style="{ borderLeftColor: stage.color }"
            >
              <div class="deal-name">{{ element.name }}</div>
              <div class="deal-properti">{{ element.properti }}</div>
              <div class="deal-harga">{{ element.harga }}</div>
            </div>
          </template>
          
          <template #footer v-if="stage.deals.length === 0">
            <div class="column-empty">
              Belum ada deal
            </div>
          </template>
        </draggable>
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

.ghost-card {
  opacity: 0.5;
  background: #e8ecf1;
}

.deal-card {
  cursor: grab;
}

.deal-card:active {
  cursor: grabbing;
}
</style>
