<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import draggable from "vuedraggable";
import { useDealStore } from "~/stores/deal";
import { useToast } from "~/composables/useToast";
import type { Deal } from "~/types/deal";
import ToastContainer from "~/components/listing/ToastContainer.vue";

definePageMeta({ layout: "dashboard" });

const store = useDealStore();
const { toasts, showToast } = useToast();

const stageConfigs = [
  { label: "Prospek", color: "#0052CC" },
  { label: "Follow-up", color: "#e07b00" },
  { label: "Nego", color: "#9333ea" },
  { label: "Closing", color: "#dc2626" },
  { label: "Deal", color: "#16a34a" },
];

const stages = ref(stageConfigs.map((c) => ({ ...c, deals: [] as Deal[] })));

const newDeal = ref({
  name: "",
  properti: "",
  harga: "",
  stage: "Prospek",
});

let originalStage = "";

// Sync local stages list with store.deals whenever it updates
watch(
  () => store.deals,
  (newDeals) => {
    stages.value.forEach((stage) => {
      stage.deals = newDeals.filter((d) => d.stage === stage.label);
    });
  },
  { deep: true, immediate: true }
);

onMounted(async () => {
  await store.fetchDeals();
});

async function onChange(event: any, stageLabel: string) {
  const stage = stages.value.find((s) => s.label === stageLabel);
  if (stage) {
    // Sync the stage's new card sequence immediately to Supabase
    await store.updateDealStageAndOrder(stageLabel, stage.deals);
  }
}

function openModal() {
  newDeal.value = {
    name: "",
    properti: "",
    harga: "",
    stage: "Prospek",
  };
  store.openModal();
}

async function addNewDeal() {
  if (
    !newDeal.value.name.trim() ||
    !newDeal.value.properti.trim() ||
    !newDeal.value.harga.trim()
  ) {
    showToast("Silakan isi semua data deal!", "error");
    return;
  }

  const currentStageCount =
    stages.value.find((s) => s.label === newDeal.value.stage)?.deals.length ||
    0;

  try {
    await store.saveNewDeal({
      name: newDeal.value.name.trim(),
      properti: newDeal.value.properti.trim(),
      harga: newDeal.value.harga.trim(),
      stage: newDeal.value.stage as any,
      order: currentStageCount,
    });
    showToast("Deal baru berhasil ditambahkan ke pipeline!", "success");
  } catch (err: any) {
    showToast(err.message || "Gagal menyimpan deal", "error");
  }
}

function openDrawer(deal: Deal) {
  originalStage = deal.stage;
  store.openDrawer(deal);
}

async function handleUpdateDeal() {
  if (!store.selectedDeal?.id) return;

  const dealId = store.selectedDeal.id;
  const hasStageChanged = store.selectedDeal.stage !== originalStage;

  let newOrder = store.selectedDeal.order;
  if (hasStageChanged) {
    newOrder =
      stages.value.find((s) => s.label === store.selectedDeal?.stage)?.deals
        .length || 0;
  }

  try {
    await store.updateDeal({
      name: store.selectedDeal.name.trim(),
      properti: store.selectedDeal.properti.trim(),
      harga: store.selectedDeal.harga.trim(),
      stage: store.selectedDeal.stage,
      order: newOrder,
      deskripsi: (store.selectedDeal.deskripsi || "").trim(),
    }, dealId);
    showToast("Detail deal berhasil diperbarui!", "success");
  } catch (err: any) {
    showToast(err.message || "Gagal memperbarui deal", "error");
  }
}

async function handleDeleteDeal() {
  if (!store.selectedDeal?.id) return;

  if (
    confirm(
      `Apakah Anda yakin ingin menghapus deal untuk ${store.selectedDeal.name}?`,
    )
  ) {
    try {
      await store.deleteDeal(store.selectedDeal.id);
      showToast("Deal berhasil dihapus dari pipeline!", "success");
    } catch (err: any) {
      showToast(err.message || "Gagal menghapus deal", "error");
    }
  }
}
</script>

<template>
  <div class="pipeline-page">
    <!-- Toast Notification System -->
    <ToastContainer :toasts="toasts" />

    <h2 class="page-title">Pipeline Kanban</h2>

    <div class="kanban-board">
      <div v-for="stage in stages" :key="stage.label" class="kanban-column">
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
              @click="openDrawer(element)"
            >
              <div class="deal-name">{{ element.name }}</div>
              <div class="deal-properti">{{ element.properti }}</div>
              <div class="deal-harga">{{ element.harga }}</div>
            </div>
          </template>

          <template #footer v-if="stage.deals.length === 0">
            <div class="column-empty">Belum ada deal</div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- Floating Action Button (FAB) -->
    <button class="fab-btn" @click="openModal" title="Tambah Pipeline Baru">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>

    <!-- Modal Form Tambah Pipeline -->
    <Transition name="fade">
      <div v-if="store.isModalOpen" class="modal-overlay" @click.self="store.closeModal">
        <div class="modal-content glass-panel">
          <div class="modal-header">
            <h3 class="modal-title">Tambah Pipeline Baru</h3>
            <button class="close-btn" @click="store.closeModal" type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
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
              <button type="button" class="btn-cancel" @click="store.closeModal">
                Batal
              </button>
              <button type="submit" class="btn-submit">Simpan Deal</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Detail Drawer (Slide-out Sidebar) -->
    <Transition name="slide">
      <div v-if="store.isDrawerOpen" class="drawer-overlay" @click.self="store.closeDrawer">
        <div class="drawer-content glass-panel" v-if="store.selectedDeal">
          <div class="drawer-header-jira">
            <div class="breadcrumbs">
              <span>Pipeline</span>
              <span class="divider">/</span>
              <span class="item-id">DEAL-#{{ store.selectedDeal.id }}</span>
            </div>
            <button class="close-btn" @click="store.closeDrawer" type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="drawer-body">
            <form @submit.prevent="handleUpdateDeal" class="drawer-form">
              <div class="form-group-title">
                <input
                  id="drawer-client"
                  v-model="store.selectedDeal.name"
                  type="text"
                  class="form-input-title"
                  placeholder="Nama Klien..."
                  required
                />
              </div>

              <!-- Section: Details -->
              <div class="drawer-section">
                <h4 class="section-title">Detail</h4>

                <div class="section-grid">
                  <div class="grid-label">Properti</div>
                  <div class="grid-value">
                    <input
                      v-model="store.selectedDeal.properti"
                      type="text"
                      class="form-input-inline"
                      placeholder="Nama Properti"
                      required
                    />
                  </div>

                  <div class="grid-label">Harga / Nilai</div>
                  <div class="grid-value">
                    <input
                      v-model="store.selectedDeal.harga"
                      type="text"
                      class="form-input-inline"
                      placeholder="Nilai Deal"
                      required
                    />
                  </div>

                  <div class="grid-label">Stage</div>
                  <div class="grid-value">
                    <div
                      class="select-badge-wrapper"
                      :style="{
                        '--badge-color':
                          stageConfigs.find(
                            (c) => c.label === store.selectedDeal?.stage,
                          )?.color || '#0052CC',
                      }"
                    >
                      <select
                        v-model="store.selectedDeal.stage"
                        class="form-select-inline"
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
                  </div>
                </div>
              </div>

              <!-- Section: Description -->
              <div class="drawer-section">
                <h4 class="section-title">Deskripsi</h4>
                <textarea
                  v-model="store.selectedDeal.deskripsi"
                  class="form-textarea-description"
                  placeholder="Tambahkan deskripsi / catatan aktivitas untuk deal ini di sini..."
                  rows="6"
                ></textarea>
              </div>

              <!-- Action buttons at bottom -->
              <div class="drawer-actions">
                <button type="button" class="btn-delete" @click="handleDeleteDeal">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon-trash"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path
                      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                    ></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                  Hapus Deal
                </button>
                <div class="main-actions">
                  <button type="button" class="btn-cancel" @click="store.closeDrawer">
                    Batal
                  </button>
                  <button type="submit" class="btn-submit">
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </form>
          </div>
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
  font-family: 'Outfit', sans-serif;
  font-size: 24px;
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
  border-left: 3px solid #0052cc;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition:
    transform var(--transition-fast),
    box-shadow var(--transition-fast),
    border var(--transition-fast);
}

.deal-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-right: 1px solid rgba(0, 82, 204, 0.08);
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
  cursor: pointer;
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
  background: linear-gradient(
    135deg,
    #0052cc 0%,
    #003d9b 100%
  );
  color: white;
  border: none;
  box-shadow:
    0 8px 24px rgba(0, 82, 204, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.2s ease;
}

.fab-btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow:
    0 12px 32px rgba(0, 82, 204, 0.4),
    0 4px 12px rgba(0, 0, 0, 0.15);
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
  transition: opacity 0.25s ease;
}

.modal-content {
  width: 100%;
  max-width: 460px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  border: 1px solid rgba(220, 225, 240, 0.4);
  transform: translateY(0);
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-title {
  font-family: 'Outfit', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #041b3c;
}

.close-btn {
  background: transparent;
  border: none;
  color: #8b8e99;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #041b3c;
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
  color: #4b5563;
}

.form-input,
.form-select {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #d7e2ff;
  background: #fff;
  font-size: 14px;
  color: #041b3c;
  transition: all 0.15s ease;
  outline: none;
}

.form-input:focus,
.form-select:focus {
  border-color: #0052cc;
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
}

.form-input::placeholder {
  color: #8b8e99;
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
  border-radius: 8px;
  border: 1px solid #d7e2ff;
  background: transparent;
  color: #4b5563;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-cancel:hover {
  background: rgba(0, 0, 0, 0.02);
  border-color: #8b8e99;
}

.btn-submit {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(
    135deg,
    #0052cc 0%,
    #003d9b 100%
  );
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 82, 204, 0.2);
  transition: all 0.15s ease;
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
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s ease;
}

/* Drawer Styles (Jira-Inspired Detail Sidebar) */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(11, 28, 48, 0.25);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  justify-content: flex-end;
  z-index: 2000;
  transition: opacity 0.25s ease;
}

.drawer-content {
  width: 100%;
  max-width: 440px;
  height: 100%;
  background: #fff;
  box-shadow: -8px 0 32px rgba(4, 27, 60, 0.12);
  display: flex;
  flex-direction: column;
  transform: translateX(0);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 1px solid rgba(220, 225, 240, 0.8);
}

.drawer-header-jira {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e8ecf1;
  background: #fdfdfd;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  color: #737685;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.breadcrumbs .divider {
  color: #cbd5e0;
}

.breadcrumbs .item-id {
  color: #0052cc;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 28px 24px;
}

.drawer-form {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.form-group-title {
  margin-bottom: 24px;
}

.form-input-title {
  width: 100%;
  border: 1px solid transparent;
  background: transparent;
  font-family: 'Outfit', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #041b3c;
  padding: 4px 8px;
  margin-left: -8px;
  border-radius: 6px;
  outline: none;
  transition: all 0.15s ease;
}

.form-input-title:hover {
  background: #f4f6fa;
}

.form-input-title:focus {
  background: #fff;
  border-color: #0052cc;
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
}

.drawer-section {
  border-top: 1px solid #e8ecf1;
  padding-top: 20px;
  margin-bottom: 24px;
}

.section-title {
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #041b3c;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.section-grid {
  display: grid;
  grid-template-columns: 100px 1fr;
  row-gap: 14px;
  align-items: center;
}

.grid-label {
  font-size: 12px;
  font-weight: 600;
  color: #737685;
}

.grid-value {
  font-size: 13px;
  color: #041b3c;
}

.form-input-inline {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d7e2ff;
  font-size: 13px;
  color: #041b3c;
  outline: none;
  background: #fff;
  transition: all 0.15s ease;
}

.form-input-inline:focus {
  border-color: #0052cc;
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.08);
}

.select-badge-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.form-select-inline {
  width: 100%;
  padding: 6px 24px 6px 10px;
  border-radius: 20px;
  border: 1px solid var(--badge-color, #0052cc);
  background: #fff;
  font-size: 11px;
  font-weight: 700;
  color: var(--badge-color, #0052cc);
  cursor: pointer;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  transition: all 0.15s ease;
}

.form-select-inline:focus {
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.08);
}

.form-textarea-description {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #d7e2ff;
  font-family: inherit;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.6;
  outline: none;
  resize: vertical;
  background: #fff;
  transition: all 0.15s ease;
}

.form-textarea-description:focus {
  border-color: #0052cc;
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.08);
}

.drawer-actions {
  border-top: 1px solid #e8ecf1;
  padding-top: 24px;
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-delete {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ef4444;
  background: transparent;
  color: #ef4444;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-delete:hover {
  background: #fef2f2;
}

.icon-trash {
  width: 14px;
  height: 14px;
}

.main-actions {
  display: flex;
  gap: 10px;
}

.main-actions .btn-cancel {
  padding: 8px 16px;
  font-size: 12px;
}

.main-actions .btn-submit {
  padding: 8px 16px;
  font-size: 12px;
}

/* Slide Transition */
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.25s ease;
}

.slide-enter-from .drawer-content {
  transform: translateX(100%);
}

.slide-leave-to .drawer-content {
  transform: translateX(100%);
}

.slide-enter-active .drawer-content,
.slide-leave-active .drawer-content {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
