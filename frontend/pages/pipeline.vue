<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import draggable from "vuedraggable";
import { useDealStore } from "~/stores/deal";
import { useListingStore } from "~/stores/listing";
import { useKlienStore } from "~/stores/klien";
import { useToast } from "~/composables/useToast";
import type { Deal } from "~/types/deal";
import ToastContainer from "~/components/listing/ToastContainer.vue";

definePageMeta({ layout: "dashboard" });

const store = useDealStore();
const listingStore = useListingStore();
const klienStore = useKlienStore();
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
  klien_id: null as number | null,
  listing_id: null as number | null,
  name: "",
  properti: "",
  harga: 0,
  stage: "Prospek",
  tipe_properti: "Rumah" as any,
  tipe_transaksi: "Jual" as any,
  prioritas: "Medium" as any,
  sumber_lead: "Referral",
  deskripsi: "",
});

let originalStage = "";
const activeTab = ref<"detail" | "financials" | "activity">("detail");

// Watch client and listing selection to auto-populate fields
watch(
  () => [newDeal.value.klien_id, newDeal.value.listing_id],
  ([newKlienId, newListingId]) => {
    const klien = klienStore.kliens.find((k) => k.id === newKlienId);
    const listing = listingStore.listings.find((l) => l.id === newListingId);

    if (klien && listing) {
      newDeal.value.name = `${listing.tipe === "Jual" ? "Pembelian" : "Sewa"} ${listing.properti} - ${klien.nama}`;
      newDeal.value.properti = listing.properti;
      newDeal.value.harga = listing.harga;
      newDeal.value.tipe_properti = listing.tipe_properti || "Rumah";
      newDeal.value.tipe_transaksi = listing.tipe || "Jual";
    } else if (klien && !listing) {
      newDeal.value.name = `Deal Baru - ${klien.nama}`;
    }
  }
);

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
  await klienStore.fetchKliens();
  await listingStore.fetchListings();
});

async function onChange(event: any, stageLabel: string) {
  const stage = stages.value.find((s) => s.label === stageLabel);
  if (stage) {
    await store.updateDealStageAndOrder(stageLabel, stage.deals);
  }
}

function openModal() {
  newDeal.value = {
    klien_id: null,
    listing_id: null,
    name: "",
    properti: "",
    harga: 0,
    stage: "Prospek",
    tipe_properti: "Rumah",
    tipe_transaksi: "Jual",
    prioritas: "Medium",
    sumber_lead: "Referral",
    deskripsi: "",
  };
  store.openModal();
}

async function addNewDeal() {
  if (!newDeal.value.klien_id) {
    showToast("Silakan pilih Klien terlebih dahulu!", "error");
    return;
  }
  if (!newDeal.value.name.trim()) {
    showToast("Silakan isi nama deal!", "error");
    return;
  }

  const currentStageCount =
    stages.value.find((s) => s.label === newDeal.value.stage)?.deals.length ||
    0;

  try {
    await store.saveNewDeal({
      klien_id: newDeal.value.klien_id,
      listing_id: newDeal.value.listing_id,
      name: newDeal.value.name.trim(),
      properti: newDeal.value.properti.trim(),
      harga: Number(newDeal.value.harga) || 0,
      stage: newDeal.value.stage as any,
      order: currentStageCount,
      tipe_properti: newDeal.value.tipe_properti,
      tipe_transaksi: newDeal.value.tipe_transaksi,
      prioritas: newDeal.value.prioritas,
      sumber_lead: newDeal.value.sumber_lead,
      deskripsi: newDeal.value.deskripsi.trim(),
    });
    showToast("Deal baru berhasil ditambahkan ke pipeline!", "success");
  } catch (err: any) {
    showToast(err.message || "Gagal menyimpan deal", "error");
  }
}

function openDrawer(deal: Deal) {
  originalStage = deal.stage;
  activeTab.value = "detail";
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
      klien_id: store.selectedDeal.klien_id,
      listing_id: store.selectedDeal.listing_id,
      name: store.selectedDeal.name.trim(),
      properti: store.selectedDeal.properti.trim(),
      harga: Number(store.selectedDeal.harga) || 0,
      stage: store.selectedDeal.stage,
      order: newOrder,
      deskripsi: (store.selectedDeal.deskripsi || "").trim(),
      tipe_properti: store.selectedDeal.tipe_properti,
      tipe_transaksi: store.selectedDeal.tipe_transaksi,
      tanggal_masuk: store.selectedDeal.tanggal_masuk,
      target_closing: store.selectedDeal.target_closing,
      sumber_lead: store.selectedDeal.sumber_lead,
      komisi_persen: Number(store.selectedDeal.komisi_persen) || 0,
      prioritas: store.selectedDeal.prioritas,
      tags: store.selectedDeal.tags || [],
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
      `Apakah Anda yakin ingin menghapus deal "${store.selectedDeal.name}"?`,
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

// Helper formatting functions
function formatRupiah(value: number | string | undefined) {
  if (value === undefined || value === null) return "Rp 0";
  const num = typeof value === "number" ? value : parseInt(value.replace(/[^0-9]/g, ""), 10);
  if (isNaN(num)) return typeof value === "string" ? value : "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

function terjemahanHarga(num: number | string | undefined): string {
  if (num === undefined || num === null) return "";
  const parsed = typeof num === "number" ? num : parseInt(num.toString().replace(/[^0-9]/g, ""), 10);
  if (isNaN(parsed) || parsed <= 0) return "";
  
  if (parsed >= 1000000000) {
    const miliar = parsed / 1000000000;
    return `Ekuivalen: Rp ${miliar.toLocaleString("id-ID", { maximumFractionDigits: 2 })} Miliar`;
  }
  if (parsed >= 1000000) {
    const juta = parsed / 1000000;
    return `Ekuivalen: Rp ${juta.toLocaleString("id-ID", { maximumFractionDigits: 2 })} Juta`;
  }
  return `Ekuivalen: Rp ${parsed.toLocaleString("id-ID")}`;
}

function getWhatsAppLink(phone: string) {
  const clean = phone.replace(/[^0-9]/g, "");
  let formatted = clean;
  if (clean.startsWith("0")) {
    formatted = "62" + clean.slice(1);
  }
  return `https://wa.me/${formatted}`;
}

const selectedClientInfo = computed(() => {
  if (!store.selectedDeal?.klien_id) return null;
  return klienStore.kliens.find((k) => k.id === store.selectedDeal?.klien_id) || null;
});

const estimatedCommission = computed(() => {
  if (!store.selectedDeal) return 0;
  const harga = Number(store.selectedDeal.harga) || 0;
  const persen = Number(store.selectedDeal.komisi_persen) || 0;
  return Math.round((persen / 100) * harga);
});

// Tags management
function toggleTag(tag: string) {
  if (!store.selectedDeal) return;
  if (!store.selectedDeal.tags) {
    store.selectedDeal.tags = [];
  }
  const idx = store.selectedDeal.tags.indexOf(tag);
  if (idx > -1) {
    store.selectedDeal.tags.splice(idx, 1);
  } else {
    store.selectedDeal.tags.push(tag);
  }
}
</script>

<template>
  <div class="pipeline-page">
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
              <div class="card-top-row">
                <span 
                  class="badge-prioritas" 
                  :class="'prioritas-' + (element.prioritas || 'Medium').toLowerCase()"
                >
                  {{ element.prioritas || "Medium" }}
                </span>
                <span 
                  class="badge-transaksi" 
                  :class="'transaksi-' + (element.tipe_transaksi || 'Jual').toLowerCase()"
                >
                  {{ element.tipe_transaksi || "Jual" }}
                </span>
              </div>
              <div class="deal-name">{{ element.name }}</div>
              <div class="deal-properti">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="icon-inline">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                {{ element.properti || "-" }}
              </div>
              <div class="card-footer-row">
                <div class="deal-harga">{{ formatRupiah(element.harga) }}</div>
                <div class="card-client-tag" v-if="element.klien">
                  <span class="client-avatar-mini">{{ element.klien.nama.charAt(0) }}</span>
                  {{ element.klien.nama }}
                </div>
              </div>
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
              <label for="modal-klien" class="form-label">Relasi Klien *</label>
              <select
                id="modal-klien"
                v-model="newDeal.klien_id"
                class="form-select"
                required
              >
                <option :value="null" disabled>Pilih klien dari direktori...</option>
                <option
                  v-for="k in klienStore.kliens"
                  :key="k.id"
                  :value="k.id"
                >
                  {{ k.nama }} ({{ k.kontak || 'Tanpa Kontak' }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="modal-listing" class="form-label">Listing Terkait (Opsional)</label>
              <select
                id="modal-listing"
                v-model="newDeal.listing_id"
                class="form-select"
              >
                <option :value="null">Tidak ada listing terkait (input manual)</option>
                <option
                  v-for="l in listingStore.listings"
                  :key="l.id"
                  :value="l.id"
                >
                  {{ l.properti }} ({{ l.tipe }} - {{ formatRupiah(l.harga) }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="deal-name" class="form-label">Nama / Judul Deal *</label>
              <input
                id="deal-name"
                v-model="newDeal.name"
                type="text"
                class="form-input"
                placeholder="Contoh: Pembelian Rumah BSD - John"
                required
              />
            </div>

            <div class="form-group-row">
              <div class="form-group">
                <label for="tipe-properti" class="form-label">Tipe Properti</label>
                <select id="tipe-properti" v-model="newDeal.tipe_properti" class="form-select">
                  <option value="Rumah">Rumah</option>
                  <option value="Ruko">Ruko</option>
                  <option value="Apartemen">Apartemen</option>
                  <option value="Kost">Kost</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Tipe Transaksi</label>
                <div class="radio-toggle-group">
                  <label class="radio-toggle-label" :class="{ active: newDeal.tipe_transaksi === 'Jual' }">
                    <input type="radio" value="Jual" v-model="newDeal.tipe_transaksi" class="hidden-radio" /> Jual
                  </label>
                  <label class="radio-toggle-label" :class="{ active: newDeal.tipe_transaksi === 'Sewa' }">
                    <input type="radio" value="Sewa" v-model="newDeal.tipe_transaksi" class="hidden-radio" /> Sewa
                  </label>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="property-text" class="form-label">Properti Terkait (Teks)</label>
              <input
                id="property-text"
                v-model="newDeal.properti"
                type="text"
                class="form-input"
                placeholder="Contoh: Rumah Minimalis Jaksel"
              />
            </div>

            <div class="form-group">
              <label for="price-val" class="form-label">Harga / Nilai Deal (Nominal Rupiah)</label>
              <input
                id="price-val"
                v-model.number="newDeal.harga"
                type="number"
                class="form-input"
                placeholder="Contoh: 850000000"
                required
              />
              <span class="price-word-hint" v-if="newDeal.harga">
                {{ terjemahanHarga(newDeal.harga) }}
              </span>
            </div>

            <div class="form-group-row">
              <div class="form-group">
                <label for="stage-select" class="form-label">Stage Awal</label>
                <select id="stage-select" v-model="newDeal.stage" class="form-select" required>
                  <option v-for="c in stageConfigs" :key="c.label" :value="c.label">{{ c.label }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="prioritas-select" class="form-label">Prioritas</label>
                <select id="prioritas-select" v-model="newDeal.prioritas" class="form-select">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="store.closeModal">Batal</button>
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
          <!-- Drawer Header -->
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

          <!-- Drawer Navigation Tabs -->
          <div class="drawer-tabs">
            <button
              type="button"
              class="tab-btn"
              :class="{ active: activeTab === 'detail' }"
              @click="activeTab = 'detail'"
            >
              📁 Detail
            </button>
            <button
              type="button"
              class="tab-btn"
              :class="{ active: activeTab === 'financials' }"
              @click="activeTab = 'financials'"
            >
              💰 Finansial
            </button>
            <button
              type="button"
              class="tab-btn"
              :class="{ active: activeTab === 'activity' }"
              @click="activeTab = 'activity'"
            >
              📝 Timeline
            </button>
          </div>

          <!-- Form wraps both scroll body and sticky footer -->
          <form @submit.prevent="handleUpdateDeal" class="drawer-form-wrapper">
            <!-- Drawer Body Scroll Area -->
            <div class="drawer-body">
              <!-- Deal Name Title Input -->
              <div class="form-group-title">
                <input
                  id="drawer-client"
                  v-model="store.selectedDeal.name"
                  type="text"
                  class="form-input-title"
                  placeholder="Judul deal..."
                  required
                />
              </div>

              <!-- Tab content 1: DETAIL -->
              <div v-show="activeTab === 'detail'" class="tab-pane">
                <div class="drawer-section">
                  <h4 class="section-title">Relasi & CRM Klien</h4>
                  <div class="section-grid">
                    <div class="grid-label">Pilih Klien</div>
                    <div class="grid-value">
                      <select v-model="store.selectedDeal.klien_id" class="form-select-inline-block" required>
                        <option :value="null" disabled>Pilih Klien...</option>
                        <option v-for="k in klienStore.kliens" :key="k.id" :value="k.id">
                          {{ k.nama }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- WhatsApp contact quick connection widget -->
                  <div class="client-contact-box" v-if="selectedClientInfo">
                    <div class="contact-info">
                      <div class="contact-row">
                        <span class="contact-lbl">Klien:</span>
                        <span class="contact-val">{{ selectedClientInfo.nama }}</span>
                      </div>
                      <div class="contact-row">
                        <span class="contact-lbl">Kontak:</span>
                        <span class="contact-val">{{ selectedClientInfo.kontak || '-' }}</span>
                      </div>
                    </div>
                    <a
                      v-if="selectedClientInfo.kontak"
                      :href="getWhatsAppLink(selectedClientInfo.kontak)"
                      target="_blank"
                      class="btn-whatsapp"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="icon-wa">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                      Hubungi via WhatsApp
                    </a>
                  </div>
                </div>

                <div class="drawer-section">
                  <h4 class="section-title">Karakteristik Deal</h4>
                  <div class="section-grid">
                    <div class="grid-label">Listing Terkait</div>
                    <div class="grid-value">
                      <select v-model="store.selectedDeal.listing_id" class="form-select-inline-block">
                        <option :value="null">Tidak ada listing terkait</option>
                        <option v-for="l in listingStore.listings" :key="l.id" :value="l.id">
                          {{ l.properti }}
                        </option>
                      </select>
                    </div>

                    <div class="grid-label">Properti (Teks)</div>
                    <div class="grid-value">
                      <input
                        v-model="store.selectedDeal.properti"
                        type="text"
                        class="form-input-inline"
                        placeholder="Property name"
                        required
                      />
                    </div>

                    <div class="grid-label">Tipe Properti</div>
                    <div class="grid-value">
                      <select v-model="store.selectedDeal.tipe_properti" class="form-select-inline-block">
                        <option value="Rumah">Rumah</option>
                        <option value="Ruko">Ruko</option>
                        <option value="Apartemen">Apartemen</option>
                        <option value="Kost">Kost</option>
                        <option value="Villa">Villa</option>
                      </select>
                    </div>

                    <div class="grid-label">Tipe Transaksi</div>
                    <div class="grid-value">
                      <div class="radio-toggle-group">
                        <label 
                          class="radio-toggle-label-mini" 
                          :class="{ active: store.selectedDeal.tipe_transaksi === 'Jual' }"
                        >
                          <input type="radio" value="Jual" v-model="store.selectedDeal.tipe_transaksi" class="hidden-radio" /> Jual
                        </label>
                        <label 
                          class="radio-toggle-label-mini" 
                          :class="{ active: store.selectedDeal.tipe_transaksi === 'Sewa' }"
                        >
                          <input type="radio" value="Sewa" v-model="store.selectedDeal.tipe_transaksi" class="hidden-radio" /> Sewa
                        </label>
                      </div>
                    </div>

                    <div class="grid-label">Tanggal Masuk</div>
                    <div class="grid-value">
                      <input
                        v-model="store.selectedDeal.tanggal_masuk"
                        type="date"
                        class="form-input-inline"
                        required
                      />
                    </div>

                    <div class="grid-label">Target Closing</div>
                    <div class="grid-value">
                      <input
                        v-model="store.selectedDeal.target_closing"
                        type="date"
                        class="form-input-inline"
                      />
                    </div>

                    <div class="grid-label">Sumber Lead</div>
                    <div class="grid-value">
                      <select v-model="store.selectedDeal.sumber_lead" class="form-select-inline-block">
                        <option value="Referral">Referral</option>
                        <option value="OLX">OLX</option>
                        <option value="Website">Website</option>
                        <option value="Cold Call">Cold Call</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div class="grid-label">Prioritas</div>
                    <div class="grid-value">
                      <select v-model="store.selectedDeal.prioritas" class="form-select-inline-block">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>

                    <div class="grid-label">Kanban Stage</div>
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
                          <option v-for="c in stageConfigs" :key="c.label" :value="c.label">{{ c.label }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Label Tag chips multiselect -->
                <div class="drawer-section">
                  <h4 class="section-title">Label / Tag VIP</h4>
                  <div class="tag-chips-container">
                    <span
                      v-for="tag in ['Hot', 'Cold', 'VIP', 'New', 'Deal']"
                      :key="tag"
                      class="tag-pill-choice"
                      :class="{ selected: store.selectedDeal.tags?.includes(tag) }"
                      @click="toggleTag(tag)"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Tab content 2: FINANCIALS -->
              <div v-show="activeTab === 'financials'" class="tab-pane">
                <div class="drawer-section">
                  <h4 class="section-title">Nilai Transaksi</h4>
                  <div class="form-group">
                    <label class="form-label">Harga Deal (Nominal Rupiah)</label>
                    <input
                      v-model.number="store.selectedDeal.harga"
                      type="number"
                      class="form-input-inline-large"
                      required
                    />
                    <span class="price-word-hint-large" v-if="store.selectedDeal.harga">
                      {{ terjemahanHarga(store.selectedDeal.harga) }}
                    </span>
                  </div>
                </div>

                <div class="drawer-section">
                  <h4 class="section-title">Komisi Pendapatan Agen</h4>
                  <div class="form-group">
                    <label class="form-label">Persentase Komisi (%)</label>
                    <input
                      v-model.number="store.selectedDeal.komisi_persen"
                      type="number"
                      step="0.1"
                      class="form-input-inline-large"
                      placeholder="Contoh: 2.5"
                      required
                    />
                  </div>

                  <!-- Real-time dynamic commission calculator card -->
                  <div class="commission-display-card">
                    <div class="display-label">ESTIMASI KOMISI ANDA</div>
                    <div class="display-value">{{ formatRupiah(estimatedCommission) }}</div>
                    <div class="display-subtext">
                      Hasil perhitungan otomatis: {{ store.selectedDeal.komisi_persen }}% dari {{ formatRupiah(store.selectedDeal.harga) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tab content 3: TIMELINE & DESCRIPTION -->
              <div v-show="activeTab === 'activity'" class="tab-pane">
                <div class="drawer-section-plain">
                  <h4 class="section-title">Deskripsi / Catatan Tambahan</h4>
                  <textarea
                    v-model="store.selectedDeal.deskripsi"
                    class="form-textarea-description"
                    placeholder="Tambahkan catatan detail untuk transaksi ini..."
                    rows="5"
                  ></textarea>
                </div>

                <div class="drawer-section">
                  <h4 class="section-title">Riwayat Aktivitas & Timeline</h4>
                  
                  <div class="timeline-container" v-if="store.selectedDeal.activity_log && store.selectedDeal.activity_log.length > 0">
                    <div 
                      v-for="(log, idx) in [...store.selectedDeal.activity_log].reverse()" 
                      :key="idx" 
                      class="timeline-item"
                    >
                      <div class="timeline-dot"></div>
                      <div class="timeline-content">
                        <div class="timeline-action">{{ log.action }}</div>
                        <div class="timeline-time">{{ log.timestamp }}</div>
                      </div>
                    </div>
                  </div>

                  <div class="timeline-empty" v-else>
                    Belum ada riwayat aktivitas tercatat pada deal ini.
                  </div>
                </div>
              </div>
            </div>

            <!-- Action buttons at bottom -->
            <div class="drawer-actions">
              <button type="button" class="btn-delete" @click="handleDeleteDeal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
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
                Hapus
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
  min-height: 520px;
}

.kanban-column {
  background: #f4f6fa;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.02);
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
  color: #555866;
  background: #fff;
  padding: 2px 8px;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.column-body {
  padding: 0 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.deal-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  border-left: 3.5px solid #0052cc;
  box-shadow: 0 1.5px 3px rgba(4, 27, 60, 0.04);
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

.card-top-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.badge-prioritas {
  font-size: 9px;
  font-weight: 700;
  padding: 1.5px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.prioritas-low {
  background: #f3f4f6;
  color: #4b5563;
}

.prioritas-medium {
  background: #eff6ff;
  color: #1d4ed8;
}

.prioritas-high {
  background: #fef2f2;
  color: #dc2626;
}

.badge-transaksi {
  font-size: 9px;
  font-weight: 700;
  padding: 1.5px 6px;
  border-radius: 4px;
}

.transaksi-jual {
  background: #f0fdf4;
  color: #16a34a;
}

.transaksi-sewa {
  background: #fdf2f8;
  color: #db2777;
}

.deal-name {
  font-size: 13px;
  font-weight: 700;
  color: #041b3c;
  margin-bottom: 6px;
  line-height: 1.4;
}

.deal-properti {
  font-size: 11.5px;
  color: #5b5f70;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon-inline {
  color: #9ca3af;
  flex-shrink: 0;
}

.card-footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px dashed #f0f2f5;
  padding-top: 8px;
  margin-top: 4px;
}

.deal-harga {
  font-size: 12px;
  color: #0f172a;
  font-weight: 700;
}

.card-client-tag {
  font-size: 10.5px;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 12px;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.client-avatar-mini {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #0052cc;
  color: #fff;
  font-size: 8px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.column-empty {
  font-size: 12px;
  color: #a1a5b0;
  text-align: center;
  padding: 24px 0;
  border: 1px dashed #e2e8f0;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.4);
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
  opacity: 0.4;
  background: #e2e8f0;
  border: 1.5px dashed #94a3b8;
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
  background: linear-gradient(135deg, #0052cc 0%, #003d9b 100%);
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

/* Modal and Drawer General Layouts */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(11, 28, 48, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 14px;
  padding: 28px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(220, 225, 240, 0.6);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-title {
  font-family: 'Outfit', sans-serif;
  font-size: 19px;
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
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-label {
  font-size: 12.5px;
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
  font-size: 13.5px;
  color: #041b3c;
  outline: none;
  transition: all 0.15s ease;
}

.form-input:focus,
.form-select:focus {
  border-color: #0052cc;
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.10);
}

.radio-toggle-group {
  display: flex;
  border: 1px solid #d7e2ff;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  height: 38px;
}

.radio-toggle-label {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13.5px;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.15s ease;
}

.radio-toggle-label.active {
  background: #0052cc;
  color: #fff;
}

.radio-toggle-label-mini {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #4b5563;
  cursor: pointer;
  border: 1px solid #d7e2ff;
  padding: 4px 10px;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.radio-toggle-label-mini.active {
  background: #0052cc;
  color: #fff;
  border-color: #0052cc;
}

.hidden-radio {
  display: none;
}

.price-word-hint {
  font-size: 11.5px;
  color: #059669;
  font-weight: 600;
  margin-top: 2px;
}

.price-word-hint-large {
  font-size: 13px;
  color: #059669;
  font-weight: 700;
  margin-top: 4px;
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
  font-size: 13.5px;
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
  background: linear-gradient(135deg, #0052cc 0%, #003d9b 100%);
  color: white;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 82, 204, 0.2);
  transition: all 0.15s ease;
}

.btn-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 82, 204, 0.3);
}

/* Drawer overlay container */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(11, 28, 48, 0.3);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  justify-content: flex-end;
  z-index: 2000;
}

.drawer-content {
  width: 100%;
  max-width: 480px;
  height: 100%;
  background: #fff;
  box-shadow: -10px 0 40px rgba(4, 27, 60, 0.15);
  display: flex;
  flex-direction: column;
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

/* Beautiful custom tab navigation for drawer */
.drawer-tabs {
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 4px 12px 0;
}

.tab-btn {
  flex: 1;
  padding: 12px 6px;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  border: none;
  background: transparent;
  cursor: pointer;
  position: relative;
  transition: all 0.15s ease;
}

.tab-btn:hover {
  color: #0f172a;
}

.tab-btn.active {
  color: #0052cc;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 15%;
  right: 15%;
  height: 3px;
  background: #0052cc;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.drawer-form-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.form-group-title {
  margin-bottom: 20px;
}

.form-input-title {
  width: 100%;
  border: 1px solid transparent;
  background: transparent;
  font-family: 'Outfit', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #041b3c;
  padding: 6px 10px;
  margin-left: -10px;
  border-radius: 6px;
  outline: none;
  transition: all 0.15s ease;
}

.form-input-title:hover {
  background: #f1f5f9;
}

.form-input-title:focus {
  background: #fff;
  border-color: #0052cc;
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.08);
}

.tab-pane {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.drawer-section {
  border-top: 1px solid #e2e8f0;
  padding-top: 18px;
  margin-bottom: 18px;
}

.drawer-section-plain {
  margin-bottom: 18px;
}

.section-title {
  font-family: 'Outfit', sans-serif;
  font-size: 12.5px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 14px 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.section-grid {
  display: grid;
  grid-template-columns: 110px 1fr;
  row-gap: 14px;
  align-items: center;
}

.grid-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.grid-value {
  font-size: 13px;
  color: #0f172a;
}

.form-input-inline,
.form-select-inline-block {
  width: 100%;
  box-sizing: border-box;
  padding: 7px 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 13px;
  color: #0f172a;
  outline: none;
  background: #fff;
  transition: all 0.15s ease;
}

.form-input-inline:focus,
.form-select-inline-block:focus {
  border-color: #0052cc;
  box-shadow: 0 0 0 2.5px rgba(0, 82, 204, 0.06);
}

.form-input-inline-large {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  outline: none;
  background: #fff;
  transition: all 0.15s ease;
}

.form-input-inline-large:focus {
  border-color: #0052cc;
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.06);
}

/* Premium client contact box */
.client-contact-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 14px;
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-row {
  display: flex;
  gap: 6px;
  font-size: 12px;
}

.contact-lbl {
  font-weight: 600;
  color: #64748b;
  width: 50px;
}

.contact-val {
  font-weight: 700;
  color: #1e293b;
}

.btn-whatsapp {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #10b981;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
  transition: all 0.15s ease;
}

.btn-whatsapp:hover {
  background: #059669;
  transform: translateY(-1px);
}

.icon-wa {
  flex-shrink: 0;
}

/* Select badge wrapper */
.select-badge-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.form-select-inline {
  width: 100%;
  padding: 6px 24px 6px 10px;
  border-radius: 20px;
  border: 1.5px solid var(--badge-color, #0052cc);
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

/* Tags selection chips */
.tag-chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-pill-choice {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
  background: #fff;
}

.tag-pill-choice:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.tag-pill-choice.selected {
  background: #0f172a;
  color: #fff;
  border-color: #0f172a;
}

/* Premium commission calculate box */
.commission-display-card {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 10px;
  padding: 18px;
  color: #fff;
  margin-top: 16px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
}

.display-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #94a3b8;
  margin-bottom: 6px;
}

.display-value {
  font-size: 22px;
  font-weight: 800;
  color: #34d399;
  font-family: 'Outfit', sans-serif;
  margin-bottom: 6px;
}

.display-subtext {
  font-size: 10.5px;
  color: #cbd5e1;
  line-height: 1.4;
}

.form-textarea-description {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-family: inherit;
  font-size: 13px;
  color: #334155;
  line-height: 1.6;
  outline: none;
  resize: vertical;
  background: #fff;
  transition: all 0.15s ease;
}

.form-textarea-description:focus {
  border-color: #0052cc;
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.06);
}

/* Beautiful activity log vertical timeline */
.timeline-container {
  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 20px;
  margin-top: 10px;
}

.timeline-container::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background: #cbd5e1;
}

.timeline-item {
  position: relative;
  margin-bottom: 16px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -20px;
  top: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #0052cc;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px #cbd5e1;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.timeline-action {
  font-size: 12.5px;
  font-weight: 600;
  color: #1e293b;
}

.timeline-time {
  font-size: 10.5px;
  color: #64748b;
  font-weight: 500;
}

.timeline-empty {
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
  padding: 20px 0;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
}

/* Action buttons footer inside drawer (sticky footer) */
.drawer-actions {
  border-top: 1px solid #e8ecf1;
  padding: 16px 24px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
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
  width: 13px;
  height: 13px;
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
