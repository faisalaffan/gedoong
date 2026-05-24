<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useKlienStore } from "~/stores/klien";
import { useDealStore } from "~/stores/deal";
import { useToast } from "~/composables/useToast";
import type { Klien } from "~/types/klien";

const store = useKlienStore();
const dealStore = useDealStore();
const { showToast } = useToast();

const form = ref<Partial<Klien>>({
  nama: "",
  kontak: "",
  properti: "",
  pipeline: "Prospek",
  catatan: "",
  foto_url: "",
  email: "",
  tipe_klien: "Pembeli",
  sumber_klien: "Referral",
  catatan_aktivitas: []
});

const errors = ref({
  nama: "",
  kontak: "",
});

const isDeleting = ref(false);
const isUploading = ref(false);

// Local file upload states
const potoFile = ref<File | null>(null);
const potoPreview = ref<string | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

// Watch for selectedKlien changes to sync form state
watch(
  () => store.selectedKlien,
  (newVal) => {
    if (newVal) {
      form.value = {
        nama: newVal.nama || "",
        kontak: newVal.kontak || "",
        properti: newVal.properti || "",
        pipeline: newVal.pipeline || "Prospek",
        catatan: newVal.catatan || "",
        foto_url: newVal.foto_url || "",
        harga: newVal.harga || "",
        email: newVal.email || "",
        tipe_klien: newVal.tipe_klien || "Pembeli",
        sumber_klien: newVal.sumber_klien || "Referral",
        catatan_aktivitas: newVal.catatan_aktivitas || []
      };
      errors.value = { nama: "", kontak: "" };
      potoPreview.value = newVal.foto_url || null;
      potoFile.value = null;
    }
  },
  { immediate: true },
);

function validateForm() {
  let isValid = true;
  errors.value = { nama: "", kontak: "" };

  if (!form.value.nama?.trim()) {
    errors.value.nama = "Nama klien wajib diisi";
    isValid = false;
  }
  if (!form.value.kontak?.trim()) {
    errors.value.kontak = "Kontak klien wajib diisi";
    isValid = false;
  }

  return isValid;
}

function triggerFileInput() {
  fileInputRef.value?.click();
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (!file.type.startsWith("image/")) {
      showToast("Format file harus berupa gambar!", "error");
      return;
    }
    potoFile.value = file;
    potoPreview.value = URL.createObjectURL(file);
  }
}

function removePhoto() {
  potoFile.value = null;
  potoPreview.value = null;
  form.value.foto_url = "";
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
}

async function handleSave() {
  if (!validateForm()) {
    showToast("Silakan lengkapi formulir dengan benar", "error");
    return;
  }

  isUploading.value = true;
  try {
    const supabase = useSupabaseClient<any>();
    let finalFotoUrl = form.value.foto_url || "";

    // Upload client photo if a new file is chosen
    if (potoFile.value) {
      const file = potoFile.value;
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "");
      const filePath = `klien-${Date.now()}-${cleanFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("listings") // utilizing existing public listings bucket
        .upload(filePath, file);

      if (uploadError) {
        throw new Error("Gagal mengupload foto: " + uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("listings")
        .getPublicUrl(filePath);
      if (!publicUrlData?.publicUrl) {
        throw new Error("Gagal mendapatkan URL publik foto.");
      }
      finalFotoUrl = publicUrlData.publicUrl;
    }

    form.value.foto_url = finalFotoUrl;

    const isEditing = store.editingKlienId !== null;
    await store.saveKlien(form.value, store.editingKlienId);
    showToast(
      isEditing
        ? "Detail klien berhasil diperbarui!"
        : "Klien baru berhasil ditambahkan!",
      "success",
    );
  } catch (err: any) {
    showToast(err.message || "Gagal menyimpan data klien", "error");
  } finally {
    isUploading.value = false;
  }
}

async function handleDelete() {
  if (!store.selectedKlien) return;
  if (
    !confirm(
      `Apakah Anda yakin ingin menghapus klien "${store.selectedKlien.nama}"?`,
    )
  ) {
    return;
  }

  isDeleting.value = true;
  try {
    await store.deleteKlien(store.selectedKlien);
    showToast("Klien berhasil dihapus dari direktori", "success");
  } catch (err: any) {
    showToast(err.message || "Gagal menghapus klien", "error");
  } finally {
    isDeleting.value = false;
  }
}

function copyContact() {
  if (!store.selectedKlien?.kontak) return;
  navigator.clipboard.writeText(store.selectedKlien.kontak);
  showToast("Nomor kontak berhasil disalin!", "success");
}

function getWhatsAppUrl(kontak: string) {
  let cleanNumber = kontak.replace(/\D/g, "");
  if (cleanNumber.startsWith("0")) {
    cleanNumber = "62" + cleanNumber.substring(1);
  }
  return `https://wa.me/${cleanNumber}`;
}

// 1:many deals query
const relatedDeals = computed(() => {
  if (!store.selectedKlien?.id) return [];
  return dealStore.deals.filter(d => d.klien_id === store.selectedKlien?.id);
});

// Activity Logging state & action
const newActivityText = ref("");
const isSavingActivity = ref(false);

async function addActivityNote() {
  if (!newActivityText.value.trim() || !store.selectedKlien) return;

  isSavingActivity.value = true;
  try {
    const logEntry = {
      timestamp: new Date().toLocaleString("id-ID"),
      content: newActivityText.value.trim()
    };

    const updatedActivities = [...(store.selectedKlien.catatan_aktivitas || []), logEntry];

    await store.saveKlien({
      ...store.selectedKlien,
      catatan_aktivitas: updatedActivities
    }, store.selectedKlien.id || null);

    newActivityText.value = "";
    showToast("Catatan aktivitas berhasil ditambahkan!", "success");
  } catch (err: any) {
    showToast(err.message || "Gagal menyimpan catatan aktivitas", "error");
  } finally {
    isSavingActivity.value = false;
  }
}

// Formatting helpers
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

const registrationDate = computed(() => {
  if (!store.selectedKlien?.created_at) return "-";
  return new Date(store.selectedKlien.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});
</script>

<template>
  <div class="drawer-container">
    <!-- Header -->
    <div class="drawer-header">
      <h3 class="drawer-title">
        {{
          store.isDrawerEditing
            ? store.editingKlienId !== null
              ? "Edit Klien"
              : "Tambah Klien Baru"
            : "Detail Klien"
        }}
      </h3>
      <button class="btn-close" @click="store.closeDrawer">&times;</button>
    </div>

    <!-- Scrollable Body -->
    <div class="drawer-body">
      <!-- Loading Overlay during upload -->
      <div v-if="isUploading" class="uploader-overlay">
        <div class="spinner"></div>
        <span class="uploader-status-msg">Mengupload data & foto klien...</span>
      </div>

      <!-- 1. VIEW MODE (Read-only Detail) -->
      <div
        v-else-if="!store.isDrawerEditing && store.selectedKlien"
        class="view-mode"
      >
        <div class="profile-card">
          <div class="profile-avatar">
            <img
              v-if="store.selectedKlien.foto_url"
              :src="store.selectedKlien.foto_url"
              class="profile-avatar-img"
            />
            <span v-else>{{
              store.selectedKlien.nama.charAt(0).toUpperCase()
            }}</span>
          </div>
          <h4 class="profile-name">{{ store.selectedKlien.nama }}</h4>
          <span
            class="profile-stage-badge"
            :class="`stage-${store.selectedKlien.pipeline.toLowerCase().replace(' ', '')}`"
          >
            {{ store.selectedKlien.pipeline }}
          </span>
        </div>

        <!-- CRM basic info -->
        <div class="details-section">
          <div class="crm-info-card">
            <h4 class="section-title">Informasi Dasar Klien</h4>
            
            <div class="info-row">
              <span class="info-label">No. Telepon</span>
              <div class="info-value-action">
                <span class="info-value font-mono">{{ store.selectedKlien.kontak }}</span>
                <div class="badge-actions">
                  <button class="btn-copy-mini" @click="copyContact" title="Salin nomor">Salin</button>
                  <a 
                    :href="getWhatsAppUrl(store.selectedKlien.kontak)" 
                    target="_blank" 
                    class="btn-wa-mini"
                  >
                    WA
                  </a>
                </div>
              </div>
            </div>

            <div class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value">
                <a 
                  v-if="store.selectedKlien.email" 
                  :href="`mailto:${store.selectedKlien.email}`" 
                  class="email-link"
                >
                  {{ store.selectedKlien.email }}
                </a>
                <span v-else class="text-muted font-italic">Tidak ada email</span>
              </span>
            </div>

            <div class="info-row-grid">
              <div class="info-sub-row">
                <span class="info-label">Tipe Klien</span>
                <span 
                  class="badge-tipe-lg"
                  :class="'tipe-' + (store.selectedKlien.tipe_klien || 'Pembeli').toLowerCase()"
                >
                  {{ store.selectedKlien.tipe_klien || 'Pembeli' }}
                </span>
              </div>

              <div class="info-sub-row">
                <span class="info-label">Sumber Klien</span>
                <span class="badge-sumber-lg">
                  {{ store.selectedKlien.sumber_klien || 'Referral' }}
                </span>
              </div>
            </div>

            <div class="info-row">
              <span class="info-label">Terdaftar Sejak</span>
              <span class="info-value text-semibold">{{ registrationDate }}</span>
            </div>
          </div>

          <!-- Deals Terkait (1:many list) -->
          <div class="crm-info-card">
            <div class="section-header-row">
              <h4 class="section-title">Deals Terkait ({{ relatedDeals.length }})</h4>
              <NuxtLink 
                :to="'/pipeline?new_deal_klien=' + store.selectedKlien.id" 
                class="btn-add-deal-link"
              >
                + Tambah Deal
              </NuxtLink>
            </div>

            <div class="deals-list" v-if="relatedDeals.length > 0">
              <div v-for="d in relatedDeals" :key="d.id" class="deal-item-card">
                <div class="deal-item-top">
                  <span class="deal-item-name">{{ d.name }}</span>
                  <span class="deal-item-stage" :class="`stage-${d.stage.toLowerCase()}`">{{ d.stage }}</span>
                </div>
                <div class="deal-item-bottom">
                  <span class="deal-item-property">🏠 {{ d.properti || '-' }}</span>
                  <span class="deal-item-price">{{ formatRupiah(d.harga) }}</span>
                </div>
              </div>
            </div>

            <div class="deals-empty" v-else>
              <p class="empty-text">Klien ini belum dikaitkan dengan transaksi deal apapun di pipeline.</p>
            </div>
          </div>

          <!-- Activity notes logger and logs list -->
          <div class="crm-info-card">
            <h4 class="section-title">Catatan Klien & Aktivitas</h4>
            
            <!-- Standard Client Description notes -->
            <div class="general-desc-box" v-if="store.selectedKlien.catatan">
              <p class="desc-text">{{ store.selectedKlien.catatan }}</p>
            </div>

            <!-- Notes entry log input form -->
            <div class="activity-input-form">
              <label class="info-label">Tambah Catatan Baru</label>
              <textarea 
                v-model="newActivityText" 
                placeholder="Tulis interaksi terbaru, progress survei, atau catatan meeting..." 
                rows="3" 
                class="activity-textarea"
              ></textarea>
              <button 
                type="button" 
                class="btn-save-note" 
                @click="addActivityNote" 
                :disabled="isSavingActivity || !newActivityText.trim()"
              >
                {{ isSavingActivity ? 'Menyimpan...' : 'Simpan Catatan' }}
              </button>
            </div>

            <!-- Catatan aktivitas timeline -->
            <div class="activity-timeline-section" v-if="store.selectedKlien.catatan_aktivitas && store.selectedKlien.catatan_aktivitas.length > 0">
              <label class="info-label-timeline">Timeline Interaksi Klien</label>
              <div class="timeline-box">
                <div 
                  v-for="(log, idx) in [...store.selectedKlien.catatan_aktivitas].reverse()" 
                  :key="idx" 
                  class="timeline-row"
                >
                  <div class="timeline-row-dot"></div>
                  <div class="timeline-row-content">
                    <p class="timeline-row-text">{{ log.content }}</p>
                    <span class="timeline-row-time">{{ log.timestamp }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. EDIT / FORM MODE -->
      <div v-else class="edit-mode">
        <form @submit.prevent="handleSave" class="form-container">
          <!-- Photo Uploader Widget -->
          <div class="form-group">
            <label class="form-label">Foto Profil Klien</label>
            <div class="photo-uploader-container">
              <div class="photo-preview-box">
                <img
                  v-if="potoPreview"
                  :src="potoPreview"
                  class="photo-preview-img"
                />
                <div v-else class="photo-placeholder-icon">👤</div>
              </div>
              <div class="photo-actions">
                <input
                  type="file"
                  ref="fileInputRef"
                  @change="onFileChange"
                  accept="image/*"
                  class="hidden-file-input"
                />
                <button
                  type="button"
                  class="btn-select-photo"
                  @click="triggerFileInput"
                >
                  Pilih Foto
                </button>
                <button
                  v-if="potoPreview"
                  type="button"
                  class="btn-remove-photo"
                  @click="removePhoto"
                >
                  Hapus Foto
                </button>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="nama" class="form-label required">Nama Klien</label>
            <input
              type="text"
              id="nama"
              v-model="form.nama"
              class="form-input"
              :class="{ 'has-error': errors.nama }"
              placeholder="Masukkan nama lengkap klien"
            />
            <span v-if="errors.nama" class="error-msg">{{ errors.nama }}</span>
          </div>

          <div class="form-group">
            <label for="kontak" class="form-label required">No. Telepon / WhatsApp</label>
            <input
              type="text"
              id="kontak"
              v-model="form.kontak"
              class="form-input"
              :class="{ 'has-error': errors.kontak }"
              placeholder="Contoh: 081234567890"
            />
            <span v-if="errors.kontak" class="error-msg">{{ errors.kontak }}</span>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Alamat Email</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              class="form-input"
              placeholder="Contoh: john@example.com"
            />
          </div>

          <div class="form-group-row">
            <div class="form-group">
              <label for="tipe-klien" class="form-label">Tipe Klien</label>
              <select id="tipe-klien" v-model="form.tipe_klien" class="form-select">
                <option value="Pembeli">Pembeli</option>
                <option value="Penyewa">Penyewa</option>
                <option value="Investor">Investor</option>
              </select>
            </div>

            <div class="form-group">
              <label for="sumber-klien" class="form-label">Sumber Lead Klien</label>
              <select id="sumber-klien" v-model="form.sumber_klien" class="form-select">
                <option value="Referral">Referral</option>
                <option value="OLX">OLX</option>
                <option value="Website">Website</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="properti" class="form-label">Properti Terkait (MVP Fallback)</label>
            <input
              type="text"
              id="properti"
              v-model="form.properti"
              class="form-input"
              placeholder="Contoh: Rumah Minimalis Jaksel"
            />
          </div>

          <div class="form-group">
            <label for="pipeline" class="form-label">Pipeline Stage</label>
            <select id="pipeline" v-model="form.pipeline" class="form-select">
              <option value="Prospek">Prospek</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Nego">Nego</option>
              <option value="Closing">Closing</option>
              <option value="Deal">Deal</option>
            </select>
          </div>

          <div class="form-group">
            <label for="catatan" class="form-label">Catatan Profil Klien</label>
            <textarea
              id="catatan"
              v-model="form.catatan"
              rows="4"
              class="form-textarea"
              placeholder="Tambahkan kriteria properti khusus, detail budget, dll..."
            ></textarea>
          </div>
        </form>
      </div>
    </div>

    <!-- Footer Action Buttons -->
    <div class="drawer-footer">
      <div v-if="!store.isDrawerEditing" class="footer-actions-view">
        <button
          class="btn-footer-edit"
          @click="store.startEditing(store.selectedKlien!)"
        >
          Edit Detail Klien
        </button>
        <button
          class="btn-footer-delete"
          @click="handleDelete"
          :disabled="isDeleting"
        >
          {{ isDeleting ? "Menghapus..." : "Hapus Klien" }}
        </button>
      </div>
      <div v-else class="footer-actions-edit">
        <button
          class="btn-footer-save"
          @click="handleSave"
          :disabled="isUploading"
        >
          Simpan Perubahan
        </button>
        <button
          class="btn-footer-cancel"
          @click="store.cancelEditing"
          :disabled="isUploading"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drawer-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  font-family: "Inter", sans-serif;
}

.drawer-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e8ecf1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafb;
}

.drawer-title {
  font-family: "Outfit", sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #041b3c;
  margin: 0;
}

.btn-close {
  border: none;
  background: none;
  font-size: 24px;
  color: #8b8e99;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.15s ease;
}

.btn-close:hover {
  color: #041b3c;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  position: relative;
}

/* Uploading Overlay */
.uploader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  text-align: center;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 82, 204, 0.1);
  border-left-color: #0052cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.uploader-status-msg {
  font-size: 14px;
  font-weight: 700;
  color: #041b3c;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* View Mode Styling */
.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  background: linear-gradient(180deg, #f7f9fc 0%, #fff 100%);
  border: 1px solid #e8ecf1;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
}

.profile-avatar {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0052cc 0%, #003d9b 100%);
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  box-shadow: 0 4px 10px rgba(0, 82, 204, 0.15);
  overflow: hidden;
  position: relative;
}

.profile-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  font-size: 18px;
  font-weight: 700;
  color: #041b3c;
  margin: 0 0 8px 0;
  font-family: "Outfit", sans-serif;
}

.profile-stage-badge {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stage-prospek {
  background: #e8f0fe;
  color: #0052cc;
  border: 1px solid rgba(0, 82, 204, 0.1);
}

.stage-followup {
  background: #fff7ed;
  color: #e07b00;
  border: 1px solid rgba(224, 123, 0, 0.1);
}

.stage-nego {
  background: #f3e8ff;
  color: #9333ea;
  border: 1px solid rgba(147, 51, 234, 0.1);
}

.stage-closing {
  background: #fffbeb;
  color: #d97706;
  border: 1px solid rgba(217, 119, 6, 0.1);
}

.stage-deal {
  background: #ecfdf5;
  color: #16a34a;
  border: 1px solid rgba(22, 163, 74, 0.1);
}

.details-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Premium Info Card */
.crm-info-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.section-title {
  font-family: "Outfit", sans-serif;
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin: 0;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
  border-bottom: 1px dashed #f1f5f9;
  padding-bottom: 10px;
}

.info-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.info-row-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
  border-bottom: 1px dashed #f1f5f9;
  padding-bottom: 10px;
}

.info-sub-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
}

.info-value {
  font-size: 13.5px;
  color: #1e293b;
}

.info-value-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-copy-mini {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-copy-mini:hover {
  background: #e2e8f0;
}

.btn-wa-mini {
  background: #10b981;
  color: #fff;
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 700;
  border-radius: 4px;
  text-decoration: none;
  box-shadow: 0 1.5px 3px rgba(16, 185, 129, 0.15);
  transition: all 0.15s ease;
}

.btn-wa-mini:hover {
  background: #059669;
}

.email-link {
  color: #0052cc;
  font-weight: 600;
  text-decoration: underline;
}

.email-link:hover {
  color: #003d9b;
}

.badge-tipe-lg {
  display: inline-block;
  align-self: flex-start;
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 6px;
  text-transform: uppercase;
}

.badge-tipe-lg.tipe-pembeli {
  background: #eff6ff;
  color: #1d4ed8;
}

.badge-tipe-lg.tipe-penyewa {
  background: #fdf2f8;
  color: #db2777;
}

.badge-tipe-lg.tipe-investor {
  background: #f3e8ff;
  color: #7e22ce;
}

.badge-sumber-lg {
  display: inline-block;
  align-self: flex-start;
  font-size: 10.5px;
  font-weight: 700;
  color: #374151;
  background: #f3f4f6;
  padding: 3px 10px;
  border-radius: 6px;
}

.font-mono {
  font-family: monospace;
  font-size: 13.5px;
  font-weight: 700;
}

.text-semibold {
  font-weight: 600;
}

.btn-add-deal-link {
  background: #0052cc;
  color: #fff;
  text-decoration: none;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 82, 204, 0.1);
  transition: all 0.15s ease;
}

.btn-add-deal-link:hover {
  background: #003d9b;
}

/* Associated Deals List */
.deals-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.deal-item-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 12px;
  background: #fafcff;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.deal-item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.deal-item-name {
  font-size: 12.5px;
  font-weight: 700;
  color: #0f172a;
}

.deal-item-stage {
  font-size: 9.5px;
  font-weight: 700;
  padding: 1.5px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.deal-item-stage.stage-prospek {
  background: #e8f0fe;
  color: #0052cc;
}

.deal-item-stage.stage-followup {
  background: #fff7ed;
  color: #e07b00;
}

.deal-item-stage.stage-nego {
  background: #f3e8ff;
  color: #9333ea;
}

.deal-item-stage.stage-closing {
  background: #fffbeb;
  color: #d97706;
}

.deal-item-stage.stage-deal {
  background: #ecfdf5;
  color: #16a34a;
}

.deal-item-bottom {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  color: #64748b;
}

.deal-item-property {
  font-weight: 500;
}

.deal-item-price {
  font-weight: 700;
  color: #0f172a;
}

.deals-empty {
  padding: 16px;
  text-align: center;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
}

.empty-text {
  font-size: 11.5px;
  color: #94a3b8;
  margin: 0;
}

.general-desc-box {
  background: #fafafb;
  border-left: 3px solid #cbd5e1;
  padding: 8px 12px;
  margin-bottom: 14px;
}

.desc-text {
  font-size: 12.5px;
  color: #475569;
  line-height: 1.5;
  margin: 0;
}

/* Activity Logger Form */
.activity-input-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  margin-top: 14px;
}

.activity-textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-family: inherit;
  font-size: 12px;
  color: #334155;
  outline: none;
  resize: vertical;
}

.activity-textarea:focus {
  border-color: #0052cc;
}

.btn-save-note {
  align-self: flex-end;
  background: #0f172a;
  color: white;
  border: none;
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-save-note:hover:not(:disabled) {
  background: #1e293b;
}

.btn-save-note:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

/* Activity Logs Timeline */
.activity-timeline-section {
  display: flex;
  flex-direction: column;
  margin-top: 18px;
}

.info-label-timeline {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.timeline-box {
  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 16px;
}

.timeline-box::before {
  content: '';
  position: absolute;
  left: 3px;
  top: 4px;
  bottom: 4px;
  width: 2px;
  background: #cbd5e1;
}

.timeline-row {
  position: relative;
  margin-bottom: 14px;
}

.timeline-row:last-child {
  margin-bottom: 0;
}

.timeline-row-dot {
  position: absolute;
  left: -17px;
  top: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0052cc;
  border: 1.5px solid #fff;
  box-shadow: 0 0 0 1.5px #cbd5e1;
}

.timeline-row-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.timeline-row-text {
  font-size: 12px;
  color: #334155;
  margin: 0;
  line-height: 1.4;
}

.timeline-row-time {
  font-size: 10px;
  color: #94a3b8;
}

/* Edit Mode Styling */
.form-container {
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
  gap: 12px;
}

.form-label {
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
}

.required::after {
  content: " *";
  color: #ef4444;
}

/* Photo Uploader Styles */
.photo-uploader-container {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e8ecf1;
  border-radius: 10px;
}

.photo-preview-box {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.photo-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder-icon {
  font-size: 28px;
  color: #94a3b8;
}

.photo-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hidden-file-input {
  display: none;
}

.btn-select-photo {
  padding: 6px 12px;
  border: 1px solid #0052cc;
  border-radius: 6px;
  background: #fff;
  color: #0052cc;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
}

.btn-select-photo:hover {
  background: #f0f4ff;
}

.btn-remove-photo {
  padding: 6px 12px;
  border: 1px solid #ef4444;
  border-radius: 6px;
  background: #fff;
  color: #ef4444;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
}

.btn-remove-photo:hover {
  background: #fef2f2;
}

.form-input,
.form-select,
.form-textarea {
  border: 1px solid #d7e2ff;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  font-family: "Inter", sans-serif;
  color: #041b3c;
  outline: none;
  background: #fff;
  transition: all 0.15s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: #0052cc;
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.08);
}

.form-input.has-error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
}

.error-msg {
  font-size: 11px;
  color: #ef4444;
  margin-top: 2px;
}

.drawer-footer {
  padding: 20px 24px;
  border-top: 1px solid #e8ecf1;
  background: #fafafb;
}

.footer-actions-view {
  display: flex;
  gap: 12px;
}

.btn-footer-edit {
  flex: 2;
  padding: 11px;
  border: none;
  border-radius: 8px;
  background: #0052cc;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-footer-edit:hover {
  background: #003d9b;
}

.btn-footer-delete {
  flex: 1;
  padding: 11px;
  border: 1px solid #ef4444;
  border-radius: 8px;
  background: #fff;
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-footer-delete:hover:not(:disabled) {
  background: #fef2f2;
}

.btn-footer-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.footer-actions-edit {
  display: flex;
  gap: 12px;
}

.btn-footer-save {
  flex: 1;
  padding: 11px;
  border: none;
  border-radius: 8px;
  background: #10b981;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-footer-save:hover:not(:disabled) {
  background: #059669;
}

.btn-footer-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-footer-cancel {
  flex: 1;
  padding: 11px;
  border: 1px solid #d7e2ff;
  border-radius: 8px;
  background: #fff;
  color: #4b5563;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-footer-cancel:hover:not(:disabled) {
  background: #fafafb;
}

.btn-footer-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
