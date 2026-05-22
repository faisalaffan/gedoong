<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

definePageMeta({ layout: "dashboard" });

interface Listing {
  id?: number;
  properti: string;
  tipe: "Jual" | "Sewa";
  harga: string;
  status: "Aktif" | "Terjual" | "Draft";
  lokasi?: string;
  kamar_tidur?: number;
  kamar_mandi?: number;
  luas?: number;
  image_url?: string;
}

const listingsList = ref<Listing[]>([]);
const isModalOpen = ref(false);
const supabase = useSupabaseClient();

// Form fields for adding new listing
const formProperti = ref("");
const formTipe = ref<"Jual" | "Sewa">("Jual");
const formHarga = ref("");
const formStatus = ref<"Aktif" | "Terjual" | "Draft">("Aktif");
const formLokasi = ref("");
const formKamarTidur = ref<number | null>(null);
const formKamarMandi = ref<number | null>(null);
const formLuas = ref<number | null>(null);

const search = ref("");
const filterTipe = ref("");

// Load all listings from Supabase
async function loadListings() {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching listings:", error.message);
    return;
  }
  if (data) {
    listingsList.value = data;
  }
}

onMounted(() => {
  loadListings();
});

// Unsplash presets for premium imagery depending on the property type
const defaultHouseImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=340&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=340&fit=crop",
  "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=340&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=340&fit=crop",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=340&fit=crop",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=340&fit=crop",
];

function openModal() {
  formProperti.value = "";
  formTipe.value = "Jual";
  formHarga.value = "";
  formStatus.value = "Aktif";
  formLokasi.value = "";
  formKamarTidur.value = null;
  formKamarMandi.value = null;
  formLuas.value = null;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

async function handleAddListing() {
  if (!formProperti.value.trim() || !formHarga.value.trim()) {
    alert("Nama properti dan harga wajib diisi!");
    return;
  }

  // Pick a random premium preset image
  const randomImage =
    defaultHouseImages[Math.floor(Math.random() * defaultHouseImages.length)];

  const newListing = {
    properti: formProperti.value,
    tipe: formTipe.value,
    harga: formHarga.value,
    status: formStatus.value,
    lokasi: formLokasi.value || null,
    kamar_tidur:
      formKamarTidur.value !== null ? Number(formKamarTidur.value) : null,
    kamar_mandi:
      formKamarMandi.value !== null ? Number(formKamarMandi.value) : null,
    luas: formLuas.value !== null ? Number(formLuas.value) : null,
    image_url: randomImage,
  };

  const { error } = await supabase.from("listings").insert([newListing]);

  if (error) {
    alert("Gagal menambahkan listing ke Supabase: " + error.message);
    return;
  }

  await loadListings();
  closeModal();
}

// Filtering computed logic
const filteredListings = computed(() => {
  return listingsList.value.filter((item) => {
    const matchesSearch =
      item.properti.toLowerCase().includes(search.value.toLowerCase()) ||
      (item.lokasi &&
        item.lokasi.toLowerCase().includes(search.value.toLowerCase()));
    const matchesTipe = !filterTipe.value || item.tipe === filterTipe.value;
    return matchesSearch && matchesTipe;
  });
});

function statusClass(status: string) {
  if (status === "Aktif") return "status-aktif";
  if (status === "Terjual") return "status-terjual";
  if (status === "Draft") return "status-draft";
  return "";
}
</script>

<template>
  <div class="listing-page">
    <h2 class="page-title">Manajemen Listing</h2>

    <div class="toolbar">
      <button class="btn-add" @click="openModal">+ Tambah Listing</button>
      <div class="toolbar-right">
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Cari listing..."
        />
        <select v-model="filterTipe" class="filter-select">
          <option value="">Semua Tipe</option>
          <option value="Jual">Jual</option>
          <option value="Sewa">Sewa</option>
        </select>
      </div>
    </div>

    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Properti</th>
            <th>Tipe</th>
            <th>Harga</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in filteredListings" :key="l.id">
            <td class="cell-properti">
              <div class="properti-cell-content">
                <img
                  v-if="l.image_url"
                  :src="l.image_url"
                  class="properti-thumb"
                />
                <div class="properti-info">
                  <span class="properti-name">{{ l.properti }}</span>
                  <span class="properti-location" v-if="l.lokasi">{{
                    l.lokasi
                  }}</span>
                </div>
              </div>
            </td>
            <td>{{ l.tipe }}</td>
            <td class="cell-harga">{{ l.harga }}</td>
            <td>
              <span class="status-badge" :class="statusClass(l.status)">{{
                l.status
              }}</span>
            </td>
          </tr>
          <tr v-if="filteredListings.length === 0">
            <td colspan="4" class="no-data">
              Tidak ada listing yang ditemukan di Supabase.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Add Listing -->
    <Transition name="fade">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content glass-panel">
          <div class="modal-header">
            <h3 class="modal-title">Tambah Listing Baru</h3>
            <button class="close-btn" @click="closeModal" type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
          <form @submit.prevent="handleAddListing" class="modal-form">
            <div class="form-group">
              <label class="form-label">Nama Properti *</label>
              <input
                v-model="formProperti"
                type="text"
                class="form-input"
                placeholder="Contoh: Rumah Minimalis Jaksel"
                required
              />
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">Tipe *</label>
                <select v-model="formTipe" class="form-select" required>
                  <option value="Jual">Jual</option>
                  <option value="Sewa">Sewa</option>
                </select>
              </div>

              <div class="form-group flex-1">
                <label class="form-label">Status *</label>
                <select v-model="formStatus" class="form-select" required>
                  <option value="Aktif">Aktif</option>
                  <option value="Draft">Draft</option>
                  <option value="Terjual">Terjual</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Harga *</label>
              <input
                v-model="formHarga"
                type="text"
                class="form-input"
                placeholder="Contoh: Rp 850jt atau Rp 4.5jt/bln"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Lokasi</label>
              <input
                v-model="formLokasi"
                type="text"
                class="form-input"
                placeholder="Contoh: Jakarta Selatan"
              />
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">KT</label>
                <input
                  v-model="formKamarTidur"
                  type="number"
                  class="form-input"
                  placeholder="3"
                  min="0"
                />
              </div>

              <div class="form-group flex-1">
                <label class="form-label">KM</label>
                <input
                  v-model="formKamarMandi"
                  type="number"
                  class="form-input"
                  placeholder="2"
                  min="0"
                />
              </div>

              <div class="form-group flex-1">
                <label class="form-label">Luas (m²)</label>
                <input
                  v-model="formLuas"
                  type="number"
                  class="form-input"
                  placeholder="120"
                  min="0"
                />
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="closeModal">
                Batal
              </button>
              <button type="submit" class="btn-submit">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.listing-page {
  max-width: 1100px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #041b3c;
  margin-bottom: 24px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
}

.btn-add {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: #0052cc;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.btn-add:hover {
  background: #003d9b;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.search-input {
  height: 38px;
  padding: 0 12px;
  border: 1px solid #d7e2ff;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: #041b3c;
  outline: none;
  width: 180px;
  background: #fff;
}

.search-input:focus {
  border-color: #0052cc;
}

.filter-select {
  height: 38px;
  padding: 0 10px;
  border: 1px solid #d7e2ff;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: #041b3c;
  background: #fff;
  cursor: pointer;
  outline: none;
}

.table-card {
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 12px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table th {
  text-align: left;
  padding: 12px 16px;
  color: #737685;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  border-bottom: 1px solid #e8ecf1;
  background: #fafaf8;
}

.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  color: #434654;
}

.data-table tbody tr:hover {
  background: #fafcff;
}

.cell-properti {
  font-weight: 600;
  color: #041b3c;
}

.properti-cell-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.properti-thumb {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e8ecf1;
}

.properti-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.properti-name {
  font-weight: 600;
  color: #041b3c;
}

.properti-location {
  font-size: 11px;
  color: #737685;
}

.cell-harga {
  font-weight: 500;
}

.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.status-aktif {
  background: #e8f0fe;
  color: #0052cc;
}

.status-terjual {
  background: #dcfce7;
  color: #16a34a;
}

.status-draft {
  background: #fff7ed;
  color: #e07b00;
}

.no-data {
  text-align: center;
  padding: 24px !important;
  color: #737685;
  font-style: italic;
}

.form-row {
  display: flex;
  gap: 12px;
}

.flex-1 {
  flex: 1;
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
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-content {
  width: 100%;
  max-width: 520px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 16px;
  padding: 32px;
  box-shadow:
    0 24px 64px rgba(11, 28, 48, 0.15),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transform: translateY(0);
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 800;
  color: #041b3c;
  letter-spacing: -0.02em;
}

.close-btn {
  background: transparent;
  border: none;
  color: #737685;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.close-btn:hover {
  background: rgba(11, 28, 48, 0.05);
  color: #041b3c;
  transform: rotate(90deg);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #434654;
  letter-spacing: -0.01em;
}

.form-input {
  width: 100%;
  box-sizing: border-box;
  height: 42px;
  padding: 0 16px;
  border: 1px solid rgba(115, 118, 133, 0.2);
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  color: #041b3c;
  outline: none;
  background: rgba(255, 255, 255, 0.65);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-input:focus {
  background: #fff;
  border-color: #0052cc;
  box-shadow: 0 0 0 4px rgba(0, 82, 204, 0.12);
}

.form-select {
  width: 100%;
  box-sizing: border-box;
  height: 42px;
  padding: 0 12px;
  border: 1px solid rgba(115, 118, 133, 0.2);
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  color: #041b3c;
  background: rgba(255, 255, 255, 0.65);
  cursor: pointer;
  outline: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-select:focus {
  background: #fff;
  border-color: #0052cc;
  box-shadow: 0 0 0 4px rgba(0, 82, 204, 0.12);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

.btn-cancel {
  padding: 11px 24px;
  border-radius: 10px;
  border: 1px solid rgba(115, 118, 133, 0.2);
  background: transparent;
  color: #434654;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-cancel:hover {
  background: rgba(11, 28, 48, 0.03);
  border-color: #737685;
}

.btn-submit {
  padding: 11px 24px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #0052cc 0%, #003d9b 100%);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 82, 204, 0.25);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-submit:hover {
  transform: translateY(-1.5px);
  box-shadow: 0 6px 20px rgba(0, 82, 204, 0.35);
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
</style>
