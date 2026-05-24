<script setup lang="ts">
import { onMounted, watch } from "vue";
import draggable from "vuedraggable";
import { useListingStore } from "~/stores/listing";
import { useListingForm } from "~/composables/useListingForm";
import { useMediaUpload } from "~/composables/useMediaUpload";
import { useToast } from "~/composables/useToast";
import FormStepper from "./FormStepper.vue";

const store = useListingStore();
const { showToast } = useToast();
const supabase = useSupabaseClient();

const {
  form,
  activeTab,
  getStepStatus,
  getStepClass,
  goToTab,
  goNext,
  goPrev,
  resetForm,
  populateForm,
  buildPayload,
} = useListingForm();

const {
  imageFiles,
  floorPlanPreview,
  videoUrl,
  isUploading,
  uploadStatusMsg,
  addImages,
  removeImage,
  setFloorPlan,
  removeFloorPlan,
  uploadAllMedia,
  populateFromListing,
  resetMedia,
} = useMediaUpload();

// Watch store edit mode & populate form
function initForm() {
  if (store.editingListingId !== null && store.selectedListing) {
    populateForm(store.selectedListing);
    populateFromListing(store.selectedListing);
  } else {
    resetForm();
    resetMedia();
  }
}

onMounted(() => {
  initForm();
});

watch(
  () => store.editingListingId,
  () => {
    initForm();
  }
);

// File selection handlers
function handleMultipleFilesChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    addImages(target.files, showToast);
  }
}

function handleFloorPlanChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    setFloorPlan(target.files[0], showToast);
  }
}

// Save form
async function handleSave() {
  isUploading.value = true;
  try {
    // 1. Upload media files
    const { imageUrls, floorPlanUrl } = await uploadAllMedia(supabase);
    
    // 2. Build payload
    const payload = buildPayload(imageUrls, floorPlanUrl, videoUrl.value);
    
    // 3. Save to store
    await store.saveListing(payload, store.editingListingId);
    
    showToast(
      store.editingListingId
        ? "Listing berhasil diperbarui!"
        : "Listing baru berhasil ditambahkan!",
      "success"
    );
  } catch (err: any) {
    showToast(err.message || "Terjadi kesalahan saat menyimpan properti.", "error");
  } finally {
    isUploading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="handleSave" class="drawer-form-wizard">
    <!-- Header Section -->
    <div class="drawer-header">
      <div class="drawer-header-left">
        <h3 class="drawer-edit-title">
          {{ store.editingListingId ? "Edit Properti" : "Tambah Properti Baru" }}
        </h3>
      </div>
      <button
        class="drawer-close"
        type="button"
        @click="store.cancelEditing"
        :disabled="isUploading"
      >
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

    <!-- Loading Upload State Overlay -->
    <div class="drawer-upload-overlay" v-if="isUploading">
      <div class="uploader-spinner-box">
        <div class="stepper-spinner"></div>
        <p class="uploader-text">{{ uploadStatusMsg || "Menyimpan data properti..." }}</p>
      </div>
    </div>

    <!-- Form Wizard Stepper component -->
    <FormStepper
      :active-tab="activeTab"
      :is-uploading="isUploading"
      @go-to-tab="(tab) => goToTab(tab, isUploading)"
    />

    <!-- Tab panes scrollable contents container -->
    <div class="drawer-body-edit">
      <!-- TAB 1: UMUM -->
      <div v-show="activeTab === 'umum'" class="tab-pane">
        <h4 class="section-subtitle">🏠 Informasi Dasar Properti</h4>
        <div class="form-group">
          <label class="form-label required">Nama Properti / Listing</label>
          <input
            v-model="form.properti"
            type="text"
            class="form-input"
            placeholder="e.g. Rumah Minimalis 2 Lantai Strategis"
            required
            :disabled="isUploading"
          />
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label required">Tipe Transaksi</label>
            <select v-model="form.tipe" class="form-select" :disabled="isUploading">
              <option value="Jual">Dijual (Jual)</option>
              <option value="Sewa">Disewakan (Sewa)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label required">Harga Properti (IDR)</label>
            <input
              v-model="form.harga"
              type="number"
              class="form-input"
              placeholder="e.g. 1500000000"
              required
              min="0"
              :disabled="isUploading"
            />
          </div>

          <div class="form-group">
            <label class="form-label required">Status Listing</label>
            <select v-model="form.status" class="form-select" :disabled="isUploading">
              <option value="Aktif">Aktif (Live)</option>
              <option value="Draft">Draft (Internal)</option>
              <option value="Terjual">Terjual (Archived)</option>
            </select>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Tipe Properti</label>
            <select v-model="form.tipe_properti" class="form-select" :disabled="isUploading">
              <option value="Rumah">Rumah</option>
              <option value="Ruko">Ruko (Rumah Toko)</option>
              <option value="Apartemen">Apartemen</option>
              <option value="Tanah">Tanah</option>
              <option value="Gudang">Gudang</option>
              <option value="Kantor">Ruang Kantor</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Kondisi Bangunan</label>
            <select v-model="form.kondisi" class="form-select" :disabled="isUploading">
              <option value="Baru">Baru gres / Brand New</option>
              <option value="Bagus">Bagus Siap Huni</option>
              <option value="Butuh Renovasi">Butuh Renovasi / Perbaikan</option>
              <option value="Semi-Finished">Semi-Finished / Kosongan</option>
            </select>
          </div>
        </div>

        <h4 class="section-subtitle mt-24">📋 Dimensi & Spesifikasi Dasar</h4>
        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label">Kamar Tidur (KT)</label>
            <input
              v-model="form.kamar_tidur"
              type="number"
              class="form-input"
              placeholder="e.g. 3"
              min="0"
              :disabled="isUploading"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Kamar Mandi (KM)</label>
            <input
              v-model="form.kamar_mandi"
              type="number"
              class="form-input"
              placeholder="e.g. 2"
              min="0"
              :disabled="isUploading"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Luas Bangunan (LB - m²)</label>
            <input
              v-model="form.luas"
              type="number"
              class="form-input"
              placeholder="e.g. 120"
              min="0"
              :disabled="isUploading"
            />
          </div>
        </div>
      </div>

      <!-- TAB 2: LOKASI -->
      <div v-show="activeTab === 'lokasi'" class="tab-pane">
        <h4 class="section-subtitle">📍 Lokasi Geografis & Alamat Lengkap</h4>
        <div class="form-group">
          <label class="form-label">Alamat Lengkap</label>
          <input
            v-model="form.alamat_lengkap"
            type="text"
            class="form-input"
            placeholder="Nama jalan, nomor rumah, RT/RW, dsb..."
            :disabled="isUploading"
          />
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label">Kelurahan</label>
            <input
              v-model="form.kelurahan"
              type="text"
              class="form-input"
              placeholder="e.g. Kebayoran Lama"
              :disabled="isUploading"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Kecamatan</label>
            <input
              v-model="form.kecamatan"
              type="text"
              class="form-input"
              placeholder="e.g. Kebayoran Baru"
              :disabled="isUploading"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Kota / Kabupaten</label>
            <input
              v-model="form.kota"
              type="text"
              class="form-input"
              placeholder="e.g. Jakarta Selatan"
              :disabled="isUploading"
            />
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label">Provinsi</label>
            <input
              v-model="form.provinsi"
              type="text"
              class="form-input"
              placeholder="e.g. DKI Jakarta"
              :disabled="isUploading"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Kode Pos</label>
            <input
              v-model="form.kode_pos"
              type="text"
              class="form-input"
              placeholder="e.g. 12240"
              :disabled="isUploading"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Akses Jalan Utama</label>
            <select v-model="form.akses_jalan" class="form-select" :disabled="isUploading">
              <option value="Mobil">Dilewati Mobil (2 Arah)</option>
              <option value="Mobil Sempit">Mobil Sempit (Pas-pasan)</option>
              <option value="Motor">Hanya Motor</option>
              <option value="Jalan Raya">Pinggir Jalan Raya Utama</option>
            </select>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Latitude Koordinat</label>
            <input
              v-model="form.latitude"
              type="number"
              step="any"
              class="form-input"
              placeholder="e.g. -6.229728"
              :disabled="isUploading"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Longitude Koordinat</label>
            <input
              v-model="form.longitude"
              type="number"
              step="any"
              class="form-input"
              placeholder="e.g. 106.818006"
              :disabled="isUploading"
            />
          </div>
        </div>
      </div>

      <!-- TAB 3: FISIK -->
      <div v-show="activeTab === 'fisik'" class="tab-pane">
        <h4 class="section-subtitle">💰 Finansial, Legalitas & Tambahan</h4>
        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label">Sertifikat Properti</label>
            <select v-model="form.sertifikat" class="form-select" :disabled="isUploading">
              <option value="SHM">Sertifikat Hak Milik (SHM)</option>
              <option value="SHGB">Sertifikat Hak Guna Bangunan (SHGB)</option>
              <option value="AJB">Akta Jual Beli (AJB)</option>
              <option value="Strata Title">Strata Title / HGB Milik</option>
              <option value="Girik">Girik / Surat Adat</option>
              <option value="Lainnya">Lainnya / Belum Pecah</option>
            </select>
          </div>

          <div class="form-group" v-if="form.tipe === 'Sewa'">
            <label class="form-label">Periode Sewa</label>
            <select v-model="form.periode_sewa" class="form-select" :disabled="isUploading">
              <option value="Tahun">Per Tahun</option>
              <option value="Bulan">Per Bulan</option>
              <option value="Hari">Per Hari</option>
            </select>
          </div>

          <div class="form-group flex-row-align">
            <label class="form-switch-label">
              <input
                type="checkbox"
                v-model="form.harga_negotiable"
                class="form-switch"
                :disabled="isUploading"
              />
              Harga Bisa Nego (Negotiable)
            </label>
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label">Biaya IPL / Service (IDR)</label>
            <input
              v-model="form.biaya_ipl"
              type="number"
              class="form-input"
              placeholder="e.g. 500000"
              min="0"
              :disabled="isUploading"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Pajak Ditanggung</label>
            <select v-model="form.pajak_ditanggung" class="form-select" :disabled="isUploading">
              <option value="Pembeli">Oleh Pembeli</option>
              <option value="Penjual">Oleh Penjual</option>
              <option value="Masing-masing">Masing-masing (Pajak Sendiri)</option>
              <option value="Negotiable">Negotiable (Musyawarah)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Arah Hadap</label>
            <select v-model="form.hadap" class="form-select" :disabled="isUploading">
              <option value="Utara">Hadap Utara</option>
              <option value="Selatan">Hadap Selatan</option>
              <option value="Timur">Hadap Timur</option>
              <option value="Barat">Hadap Barat</option>
              <option value="Barat Laut">Hadap Barat Laut</option>
              <option value="Timur Laut">Hadap Timur Laut</option>
            </select>
          </div>
        </div>

        <h4 class="section-subtitle mt-24">🏢 Detail Fisik Bangunan</h4>
        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label">Jumlah Lantai</label>
            <input
              v-model="form.lantai"
              type="number"
              class="form-input"
              placeholder="e.g. 2"
              min="1"
              :disabled="isUploading"
            />
          </div>

          <div class="form-group" v-if="form.tipe_properti === 'Apartemen'">
            <label class="form-label">Lantai Ke (Level)</label>
            <input
              v-model="form.lantai_ke"
              type="number"
              class="form-input"
              placeholder="e.g. 18"
              min="1"
              :disabled="isUploading"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Luas Tanah (LT - m²)</label>
            <input
              v-model="form.luas_tanah"
              type="number"
              class="form-input"
              placeholder="e.g. 150"
              min="0"
              :disabled="isUploading"
            />
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label">Daya Listrik</label>
            <select v-model="form.daya_listrik" class="form-select" :disabled="isUploading">
              <option value="900W">900 Watt</option>
              <option value="1300W">1300 Watt</option>
              <option value="2200W">2200 Watt</option>
              <option value="3500W">3500 Watt</option>
              <option value="4400W">4400 Watt</option>
              <option value="5500W">5500 Watt</option>
              <option value="11000W+">Di atas 11.000 Watt</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Sumber Air</label>
            <select v-model="form.sumber_air" class="form-select" :disabled="isUploading">
              <option value="PDAM">PDAM / Air Bersih Kota</option>
              <option value="Sumur Bor">Sumur Bor / Air Tanah</option>
              <option value="WTP">WTP Kompleks / Mandiri</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Kapasitas Garasi / Carport</label>
            <input
              v-model="form.garasi_carport"
              type="number"
              class="form-input"
              placeholder="e.g. 2 Mobil"
              min="0"
              :disabled="isUploading"
            />
          </div>
        </div>
      </div>

      <!-- TAB 4: FASILITAS -->
      <div v-show="activeTab === 'fasilitas'" class="tab-pane">
        <h4 class="section-subtitle">🛋️ Fasilitas Dalam Properti</h4>
        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label">Status Furnished</label>
            <select v-model="form.furnished_status" class="form-select" :disabled="isUploading">
              <option value="Unfurnished">Kosong (Unfurnished)</option>
              <option value="Semi">Semi Furnished</option>
              <option value="Full">Fully Furnished</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Kondisi Dapur</label>
            <select v-model="form.dapur" class="form-select" :disabled="isUploading">
              <option value="Kering">Dapur Bersih / Kering</option>
              <option value="Basah">Dapur Basah</option>
              <option value="Keduanya">Keduanya (Dapur Kering & Basah)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Jumlah AC (Unit)</label>
            <input
              v-model="form.ac"
              type="number"
              class="form-input"
              placeholder="e.g. 3"
              min="0"
              :disabled="isUploading"
            />
          </div>

          <div class="form-group flex-row-align">
            <label class="form-switch-label">
              <input
                type="checkbox"
                v-model="form.water_heater"
                class="form-switch"
                :disabled="isUploading"
              />
              Water Heater Tersedia
            </label>
          </div>

          <div class="form-group flex-row-align">
            <label class="form-switch-label">
              <input
                type="checkbox"
                v-model="form.internet_wifi"
                class="form-switch"
                :disabled="isUploading"
              />
              Koneksi Internet/WiFi
            </label>
          </div>
        </div>

        <div class="form-group mt-12">
          <label class="form-label">Fitur Keamanan Dalam Properti</label>
          <div class="checkbox-row-container">
            <label class="check-box-label">
              <input
                type="checkbox"
                value="CCTV"
                v-model="form.keamanan_dalam"
                :disabled="isUploading"
              />
              CCTV Internal
            </label>
            <label class="check-box-label">
              <input
                type="checkbox"
                value="Intercom"
                v-model="form.keamanan_dalam"
                :disabled="isUploading"
              />
              Intercom System
            </label>
            <label class="check-box-label">
              <input
                type="checkbox"
                value="One Gate"
                v-model="form.keamanan_dalam"
                :disabled="isUploading"
              />
              Gerbang Khusus / Kartu Akses
            </label>
          </div>
        </div>

        <h4 class="section-subtitle mt-24">🏘️ Fasilitas Kompleks / Lingkungan</h4>
        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label">Nama Kompleks / Cluster</label>
            <input
              v-model="form.nama_kompleks"
              type="text"
              class="form-input"
              placeholder="Contoh: Green Residence Cluster A"
              :disabled="isUploading"
            />
          </div>

          <div class="form-group flex-row-align">
            <label class="form-switch-label">
              <input
                type="checkbox"
                v-model="form.kolam_renang"
                class="form-switch"
                :disabled="isUploading"
              />
              Kolam Renang
            </label>
          </div>

          <div class="form-group flex-row-align">
            <label class="form-switch-label">
              <input
                type="checkbox"
                v-model="form.area_bermain"
                class="form-switch"
                :disabled="isUploading"
              />
              Playground Anak
            </label>
          </div>

          <div class="form-group flex-row-align">
            <label class="form-switch-label">
              <input
                type="checkbox"
                v-model="form.masjid_mushola"
                class="form-switch"
                :disabled="isUploading"
              />
              Masjid / Mushola Kompleks
            </label>
          </div>

          <div class="form-group flex-row-align">
            <label class="form-switch-label">
              <input
                type="checkbox"
                v-model="form.keamanan_24j"
                class="form-switch"
                :disabled="isUploading"
              />
              Keamanan Kompleks 24 Jam
            </label>
          </div>
        </div>
      </div>

      <!-- TAB 5: MEDIA & ADMINISTRATIF -->
      <div v-show="activeTab === 'media'" class="tab-pane">
        <h4 class="section-subtitle">📸 Galeri Media Foto (Min 5, Max 20)</h4>

        <!-- Custom drag & drop multiple files preview -->
        <div class="multiple-upload-zone">
          <input
            type="file"
            id="multiple-property-photos"
            class="hidden-file-input"
            accept="image/*"
            multiple
            @change="handleMultipleFilesChange"
          />
          <label for="multiple-property-photos" class="multiple-upload-label">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="upload-icon"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span class="upload-text">Klik untuk pilih multiple foto properti</span>
            <span class="upload-subtext">
              Foto pertama otomatis menjadi foto utama cover listing. Drag & drop untuk atur urutan.
            </span>
          </label>
        </div>

        <!-- Reorderable images thumbnails -->
        <div class="reorderable-gallery-container" v-if="imageFiles.length > 0">
          <draggable
            v-model="imageFiles"
            item-key="id"
            class="image-grid-draggable"
            ghost-class="ghost-card"
            animation="200"
          >
            <template #item="{ element, index }">
              <div class="image-thumb-card">
                <div class="drag-handle-badge">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <circle cx="9" cy="5" r="1"></circle>
                    <circle cx="9" cy="12" r="1"></circle>
                    <circle cx="9" cy="19" r="1"></circle>
                    <circle cx="15" cy="5" r="1"></circle>
                    <circle cx="15" cy="12" r="1"></circle>
                    <circle cx="15" cy="19" r="1"></circle>
                  </svg>
                </div>
                <img :src="element.url" class="thumb-preview" />
                <div class="index-badge">{{ index + 1 }}</div>
                <button
                  type="button"
                  class="thumb-delete-btn"
                  @click="removeImage(index)"
                  :disabled="isUploading"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </template>
          </draggable>
        </div>

        <div class="form-grid-2 mt-20">
          <!-- Floor Plan / Denah -->
          <div class="form-group">
            <label class="form-label">Denah Lantai (Floor Plan)</label>
            <div v-if="floorPlanPreview" class="floorplan-preview-container">
              <img :src="floorPlanPreview" class="floorplan-preview" />
              <button
                type="button"
                class="floorplan-remove"
                @click="removeFloorPlan"
                :disabled="isUploading"
              >
                Hapus Denah
              </button>
            </div>
            <div v-else class="upload-dropzone">
              <input
                type="file"
                id="fp-upload"
                class="hidden-file-input"
                accept="image/*"
                @change="handleFloorPlanChange"
              />
              <label for="fp-upload" class="upload-label">
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
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <span class="upload-text">Unggah Denah Lantai</span>
              </label>
            </div>
          </div>

          <div class="form-group flex-col-container">
            <div class="form-group w-full">
              <label class="form-label">Video URL (YouTube/Vimeo)</label>
              <input
                v-model="videoUrl"
                type="url"
                class="form-input"
                placeholder="e.g. https://youtube.com/watch?v=..."
              />
            </div>
            <div class="form-group w-full mt-10">
              <label class="form-label">Virtual Tour URL (Matterport)</label>
              <input
                v-model="form.virtual_tour_url"
                type="url"
                class="form-input"
                placeholder="e.g. https://my.matterport.com/show/..."
              />
            </div>
          </div>
        </div>

        <h4 class="section-subtitle mt-24">📋 Administratif & Keterangan</h4>
        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label">Tersedia Untuk</label>
            <select v-model="form.tersedia_untuk" class="form-select" :disabled="isUploading">
              <option value="WNI">WNI (Warga Negara Indonesia)</option>
              <option value="WNA">WNA (Warga Negara Asing)</option>
              <option value="Keduanya">Keduanya (WNA / WNI)</option>
            </select>
          </div>

          <div class="form-group" v-if="form.tipe === 'Sewa'">
            <label class="form-label">Masa Sewa Minimum (Bulan)</label>
            <input
              v-model="form.min_masa_sewa"
              type="number"
              class="form-input"
              placeholder="e.g. 12"
              min="1"
              :disabled="isUploading"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Tanggal Tersedia (Available Date)</label>
            <input
              v-model="form.tanggal_tersedia"
              type="date"
              class="form-input"
              :disabled="isUploading"
            />
          </div>
        </div>

        <div class="form-group mt-12">
          <label class="form-label">Tag / Highlights Properti (Dipisahkan koma)</label>
          <input
            v-model="form.tags_string"
            type="text"
            class="form-input"
            placeholder="dekat tol, hook, pinggir jalan utama, minimalis"
            :disabled="isUploading"
          />
          <div class="chips-list-container" v-if="form.tags_string">
            <span
              v-for="tag in form.tags_string
                .split(',')
                .map((t) => t.trim())
                .filter((t) => t.length > 0)"
              :key="tag"
              class="tag-chip"
            >
              #{{ tag }}
            </span>
          </div>
        </div>

        <div class="form-group mt-12">
          <label class="form-label">Deskripsi Lengkap Properti</label>
          <textarea
            v-model="form.deskripsi"
            class="form-textarea"
            rows="4"
            placeholder="Deskripsikan kelebihan properti, dsb..."
            :disabled="isUploading"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Footer Navigation/Submit actions docked at the bottom -->
    <div class="drawer-footer-edit">
      <button
        type="button"
        class="btn-drawer-prev"
        v-if="activeTab !== 'umum'"
        @click="goPrev"
        :disabled="isUploading"
      >
        Sebelumnya
      </button>
      <div class="flex-spacer" v-else></div>

      <div class="drawer-footer-edit-right">
        <button
          type="button"
          class="btn-drawer-cancel"
          @click="store.cancelEditing"
          :disabled="isUploading"
        >
          Batal
        </button>
        <button
          type="button"
          class="btn-drawer-next"
          v-if="activeTab !== 'media'"
          @click="goNext"
          :disabled="isUploading"
        >
          Lanjut
        </button>
        <button
          type="submit"
          class="btn-drawer-submit"
          v-else
          :disabled="isUploading"
        >
          Simpan
        </button>
      </div>
    </div>
  </form>
</template>
