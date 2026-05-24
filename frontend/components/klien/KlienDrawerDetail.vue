<script setup lang="ts">
import { ref, watch } from "vue";
import { useKlienStore } from "~/stores/klien";
import { useToast } from "~/composables/useToast";
import type { Klien } from "~/types/klien";

const store = useKlienStore();
const { showToast } = useToast();

const form = ref<Partial<Klien>>({
  nama: "",
  kontak: "",
  properti: "",
  pipeline: "Prospek",
  catatan: "",
  foto_url: "",
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
  // Format phone number: remove non-digits, replace leading 0 with 62
  let cleanNumber = kontak.replace(/\D/g, "");
  if (cleanNumber.startsWith("0")) {
    cleanNumber = "62" + cleanNumber.substring(1);
  }
  return `https://wa.me/${cleanNumber}`;
}
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

      <!-- 1. VIEW MODE -->
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

        <div class="details-section">
          <div class="detail-group">
            <label class="detail-label">Kontak / No. Telepon</label>
            <div class="detail-value-row">
              <span class="detail-value font-mono">{{
                store.selectedKlien.kontak
              }}</span>
              <div class="action-buttons">
                <button
                  class="btn-icon"
                  title="Salin Kontak"
                  @click="copyContact"
                >
                  📋
                </button>
                <a
                  :href="getWhatsAppUrl(store.selectedKlien.kontak)"
                  target="_blank"
                  class="btn-icon-wa"
                  title="Hubungi via WhatsApp"
                >
                  💬 WA
                </a>
              </div>
            </div>
          </div>

          <div class="detail-group">
            <label class="detail-label">Properti Terkait</label>
            <span class="detail-value text-semibold">
              {{ store.selectedKlien.properti || "Tidak ada properti terkait" }}
            </span>
          </div>

          <div class="detail-group" v-if="store.selectedKlien.harga">
            <label class="detail-label">Nilai Deal / Harga</label>
            <span class="detail-value text-semibold font-mono">
              {{ store.selectedKlien.harga }}
            </span>
          </div>

          <div class="detail-group">
            <label class="detail-label">Catatan Aktivitas</label>
            <div class="notes-container">
              <p class="notes-text">
                {{
                  store.selectedKlien.catatan ||
                  "Tidak ada catatan untuk klien ini."
                }}
              </p>
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
            <label for="kontak" class="form-label required"
              >No. Telepon / WhatsApp</label
            >
            <input
              type="text"
              id="kontak"
              v-model="form.kontak"
              class="form-input"
              :class="{ 'has-error': errors.kontak }"
              placeholder="Contoh: 081234567890"
            />
            <span v-if="errors.kontak" class="error-msg">{{
              errors.kontak
            }}</span>
          </div>

          <div class="form-group">
            <label for="properti" class="form-label">Properti Terkait</label>
            <input
              type="text"
              id="properti"
              v-model="form.properti"
              class="form-input"
              placeholder="Contoh: Rumah Minimalis Jaksel"
            />
          </div>

          <div class="form-group">
            <label for="harga" class="form-label"
              >Nilai Deal / Budget Klien</label
            >
            <input
              type="text"
              id="harga"
              v-model="form.harga"
              class="form-input"
              placeholder="Contoh: Rp 850jt"
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
            <label for="catatan" class="form-label"
              >Catatan Aktivitas / Catatan Klien</label
            >
            <textarea
              id="catatan"
              v-model="form.catatan"
              rows="5"
              class="form-textarea"
              placeholder="Tambahkan detail kebutuhan properti, catatan follow-up, dll."
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
          Edit Klien
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
  background: #ecfdf5;
  color: #059669;
  border: 1px solid rgba(5, 150, 105, 0.1);
}

.details-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-label {
  font-size: 11px;
  font-weight: 600;
  color: #8b8e99;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #e8ecf1;
}

.detail-value {
  font-size: 13.5px;
  color: #041b3c;
}

.font-mono {
  font-family: monospace;
  font-size: 14px;
  font-weight: 600;
}

.text-semibold {
  font-weight: 600;
  color: #041b3c;
  font-size: 13.5px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-icon {
  background: #fff;
  border: 1px solid #d7e2ff;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s ease;
}

.btn-icon:hover {
  background: #f0f4ff;
  border-color: #0052cc;
}

.btn-icon-wa {
  background: #25d366;
  border: none;
  border-radius: 6px;
  color: #fff;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(37, 211, 102, 0.2);
  transition: all 0.15s ease;
}

.btn-icon-wa:hover {
  background: #128c7e;
  box-shadow: 0 4px 8px rgba(37, 211, 102, 0.3);
}

.notes-container {
  background: #fafafb;
  border: 1px dashed #d7e2ff;
  border-radius: 8px;
  padding: 12px 16px;
}

.notes-text {
  margin: 0;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.6;
  white-space: pre-wrap;
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
