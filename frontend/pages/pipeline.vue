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

const isModalOpen = ref(false)
const newDeal = ref({
  name: '',
  properti: '',
  harga: '',
  stage: 'Prospek'
})

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

function openModal() {
  newDeal.value = {
    name: '',
    properti: '',
    harga: '',
    stage: 'Prospek'
  }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

async function addNewDeal() {
  if (!newDeal.value.name.trim() || !newDeal.value.properti.trim() || !newDeal.value.harga.trim()) {
    return
  }

  const currentStageCount = stages.value.find(s => s.label === newDeal.value.stage)?.deals.length || 0

  await db.deals.add({
    name: newDeal.value.name.trim(),
    properti: newDeal.value.properti.trim(),
    harga: newDeal.value.harga.trim(),
    stage: newDeal.value.stage,
    order: currentStageCount
  })

  await loadDeals()
  closeModal()
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

    <!-- Floating Action Button (FAB) -->
    <button class="fab-btn" @click="openModal" title="Tambah Pipeline Baru">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>

    <!-- Modal Form Tambah Pipeline -->
    <Transition name="fade">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content glass-panel">
          <div class="modal-header">
            <h3 class="modal-title">Tambah Pipeline Baru</h3>
            <button class="close-btn" @click="closeModal" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <form @submit.prevent="addNewDeal" class="modal-form">
            <div class="form-group">
              <label for="client-name" class="form-label">Nama Klien</label>
              <input
                id="client-name"
                v-model="newDeal.name"
                type="text"
                class="form-input"
                placeholder="Contoh: John Doe"
                required
              />
            </div>

            <div class="form-group">
              <label for="property" class="form-label">Properti</label>
              <input
                id="property"
                v-model="newDeal.properti"
                type="text"
                class="form-input"
                placeholder="Contoh: Rumah Jaksel / Ruko BSD"
                required
              />
            </div>

            <div class="form-group">
              <label for="price" class="form-label">Harga / Nilai Deal</label>
              <input
                id="price"
                v-model="newDeal.harga"
                type="text"
                class="form-input"
                placeholder="Contoh: Rp 850jt"
                required
              />
            </div>

            <div class="form-group">
              <label for="stage-select" class="form-label">Stage Awal</label>
              <select
                id="stage-select"
                v-model="newDeal.stage"
                class="form-select"
                required
              >
                <option
                  v-for="config in stageConfigs"
                  :key="config.label"
                  :value="config.label"
                >
                  {{ config.label }}
                </option>
              </select>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="closeModal">Batal</button>
              <button type="submit" class="btn-submit">Simpan Deal</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
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

/* FAB Button Styles */
.fab-btn {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
  color: white;
  border: none;
  box-shadow: 0 8px 24px rgba(0, 82, 204, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: all var(--transition-normal);
}

.fab-btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 32px rgba(0, 82, 204, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15);
}

.fab-btn:active {
  transform: translateY(-1px) scale(0.98);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(11, 28, 48, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  transition: opacity var(--transition-normal);
}

.modal-content {
  width: 100%;
  max-width: 460px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-light);
  transform: translateY(0);
  transition: transform var(--transition-normal), opacity var(--transition-normal);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-dark);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-dark);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-medium);
}

.form-input,
.form-select {
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-slate);
  background: #fff;
  font-size: 14px;
  color: var(--text-dark);
  transition: all var(--transition-fast);
  outline: none;
}

.form-input:focus,
.form-select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-glow);
}

.form-input::placeholder {
  color: var(--text-muted);
  opacity: 0.7;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

.btn-cancel {
  padding: 10px 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-slate);
  background: transparent;
  color: var(--text-medium);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-cancel:hover {
  background: rgba(0, 0, 0, 0.02);
  border-color: var(--text-muted);
}

.btn-submit {
  padding: 10px 20px;
  border-radius: var(--radius-md);
  border: none;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 82, 204, 0.2);
  transition: all var(--transition-fast);
}

.btn-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 82, 204, 0.3);
}

.btn-submit:active {
  transform: translateY(0);
}

/* Animations using Transition */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

/* Modal Content zoom animation */
.fade-enter-from .modal-content {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

.fade-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

.fade-enter-active .modal-content,
.fade-leave-active .modal-content {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}
</style>
