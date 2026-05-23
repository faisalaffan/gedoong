<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useKomisiStore } from "~/stores/komisi";
import { useToast } from "~/composables/useToast";
import { formatRupiah } from "~/utils/format";
import type { Komisi } from "~/types/komisi";

const store = useKomisiStore();
const { showToast } = useToast();

const form = ref<Partial<Komisi>>({
  properti: "",
  komisi: 0,
  tanggal: "",
  status: "Pending",
});

const errors = ref({
  properti: "",
  komisi: "",
  tanggal: "",
});

const isDeleting = ref(false);

// Watch for selectedKomisi changes to sync form state
watch(
  () => store.selectedKomisi,
  (newVal) => {
    if (newVal) {
      form.value = {
        properti: newVal.properti || "",
        komisi: newVal.komisi || 0,
        tanggal: newVal.tanggal || "",
        status: newVal.status || "Pending",
      };
      errors.value = { properti: "", komisi: "", tanggal: "" };
    }
  },
  { immediate: true },
);

// Real-time live currency format as user types
const liveKomisiFormat = computed(() => {
  const val = Number(form.value.komisi) || 0;
  if (val === 0) return "";
  const millions = val / 1000000;
  const millionStr =
    millions >= 1
      ? ` (${millions.toFixed(1).replace(".0", "").replace(".", ",")} Juta)`
      : "";
  return `${formatRupiah(val)}${millionStr}`;
});

function validateForm() {
  let isValid = true;
  errors.value = { properti: "", komisi: "", tanggal: "" };

  if (!form.value.properti?.trim()) {
    errors.value.properti = "Nama properti wajib diisi";
    isValid = false;
  }

  const komisiNum = Number(form.value.komisi);
  if (isNaN(komisiNum) || komisiNum <= 0) {
    errors.value.komisi = "Jumlah komisi harus berupa angka positif";
    isValid = false;
  }

  if (!form.value.tanggal) {
    errors.value.tanggal = "Tanggal transaksi wajib dipilih";
    isValid = false;
  }

  return isValid;
}

async function handleSave() {
  if (!validateForm()) {
    showToast("Silakan lengkapi formulir dengan benar", "error");
    return;
  }

  try {
    const isEditing = store.editingKomisiId !== null;
    // Map form value fields cleanly and cast komisi to a number
    const payload = {
      properti: form.value.properti,
      komisi: Number(form.value.komisi),
      tanggal: form.value.tanggal,
      status: form.value.status,
    };

    await store.saveKomisi(payload, store.editingKomisiId);
    showToast(
      isEditing
        ? "Catatan komisi berhasil diperbarui!"
        : "Catatan komisi baru berhasil disimpan!",
      "success",
    );
  } catch (err: any) {
    showToast(err.message || "Gagal menyimpan catatan komisi", "error");
  }
}

async function handleDelete() {
  if (!store.selectedKomisi) return;
  if (
    !confirm(
      `Apakah Anda yakin ingin menghapus catatan komisi properti "${store.selectedKomisi.properti}"?`,
    )
  ) {
    return;
  }

  isDeleting.value = true;
  try {
    await store.deleteKomisi(store.selectedKomisi);
    showToast("Catatan komisi berhasil dihapus", "success");
  } catch (err: any) {
    showToast(err.message || "Gagal menghapus catatan komisi", "error");
  } finally {
    isDeleting.value = false;
  }
}

function formatDateId(dateStr: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
</script>

<template>
  <div class="drawer-container">
    <!-- Header -->
    <div class="drawer-header">
      <h3 class="drawer-title">
        {{
          store.isDrawerEditing
            ? store.editingKomisiId !== null
              ? "Edit Catatan Komisi"
              : "Catat Komisi Baru"
            : "Detail Komisi"
        }}
      </h3>
      <button class="btn-close" @click="store.closeDrawer">&times;</button>
    </div>

    <!-- Scrollable Body -->
    <div class="drawer-body">
      <!-- 1. VIEW MODE -->
      <div
        v-if="!store.isDrawerEditing && store.selectedKomisi"
        class="view-mode"
      >
        <div class="financial-card">
          <div class="financial-icon-badge">💼</div>
          <span class="financial-label">JUMLAH KOMISI</span>
          <h4 class="financial-value">
            {{ formatRupiah(store.selectedKomisi.komisi) }}
          </h4>
          <span
            class="status-badge"
            :class="`status-${store.selectedKomisi.status.toLowerCase()}`"
          >
            {{ store.selectedKomisi.status }}
          </span>
        </div>

        <div class="details-section">
          <div class="detail-group">
            <label class="detail-label">Properti Terkait</label>
            <span class="detail-value text-semibold">
              {{ store.selectedKomisi.properti }}
            </span>
          </div>

          <div class="detail-group">
            <label class="detail-label">Tanggal Transaksi</label>
            <span class="detail-value font-mono">
              {{ formatDateId(store.selectedKomisi.tanggal) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 2. EDIT / FORM MODE -->
      <div v-else class="edit-mode">
        <form @submit.prevent="handleSave" class="form-container">
          <div class="form-group">
            <label for="properti" class="form-label required"
              >Nama Properti</label
            >
            <input
              type="text"
              id="properti"
              v-model="form.properti"
              class="form-input"
              :class="{ 'has-error': errors.properti }"
              placeholder="Contoh: Ruko BSD atau Rumah Jaksel"
            />
            <span v-if="errors.properti" class="error-msg">{{
              errors.properti
            }}</span>
          </div>

          <div class="form-group">
            <label for="komisi" class="form-label required"
              >Nilai Komisi (Rupiah)</label
            >
            <input
              type="number"
              id="komisi"
              v-model="form.komisi"
              class="form-input"
              :class="{ 'has-error': errors.komisi }"
              placeholder="Contoh: 17000000"
            />
            <span v-if="liveKomisiFormat" class="live-preview-format">
              ✨ Preview: {{ liveKomisiFormat }}
            </span>
            <span v-if="errors.komisi" class="error-msg">{{
              errors.komisi
            }}</span>
          </div>

          <div class="form-group">
            <label for="tanggal" class="form-label required"
              >Tanggal Transaksi</label
            >
            <input
              type="date"
              id="tanggal"
              v-model="form.tanggal"
              class="form-input"
              :class="{ 'has-error': errors.tanggal }"
            />
            <span v-if="errors.tanggal" class="error-msg">{{
              errors.tanggal
            }}</span>
          </div>

          <div class="form-group">
            <label for="status" class="form-label">Status Keuangan</label>
            <select id="status" v-model="form.status" class="form-select">
              <option value="Pending">Pending</option>
              <option value="Diproses">Diproses</option>
              <option value="Dibayar">Dibayar</option>
            </select>
          </div>
        </form>
      </div>
    </div>

    <!-- Footer Action Buttons -->
    <div class="drawer-footer">
      <div v-if="!store.isDrawerEditing" class="footer-actions-view">
        <button
          class="btn-footer-edit"
          @click="store.startEditing(store.selectedKomisi!)"
        >
          Edit Transaksi
        </button>
        <button
          class="btn-footer-delete"
          @click="handleDelete"
          :disabled="isDeleting"
        >
          {{ isDeleting ? "Menghapus..." : "Hapus Catatan" }}
        </button>
      </div>
      <div v-else class="footer-actions-edit">
        <button class="btn-footer-save" @click="handleSave">
          Simpan Transaksi
        </button>
        <button class="btn-footer-cancel" @click="store.cancelEditing">
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
}

/* View Mode Styling */
.financial-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px 20px;
  background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);
  border: 1px solid #e8ecf1;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
}

.financial-icon-badge {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e8f0fe 0%, #d2e3fc 100%);
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.02);
}

.financial-label {
  font-size: 10px;
  font-weight: 800;
  color: #737685;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.financial-value {
  font-family: "Outfit", sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: #041b3c;
  margin: 0 0 16px 0;
}

.status-badge {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-dibayar {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid rgba(5, 150, 105, 0.1);
}

.status-diproses {
  background: #e8f0fe;
  color: #0052cc;
  border: 1px solid rgba(0, 82, 204, 0.1);
}

.status-pending {
  background: #fff7ed;
  color: #e07b00;
  border: 1px solid rgba(224, 123, 0, 0.1);
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

.detail-value {
  font-size: 14px;
  color: #4b5563;
}

.text-semibold {
  font-weight: 700;
  color: #041b3c;
  font-size: 14px;
}

.font-mono {
  font-family: "Inter", sans-serif;
  font-weight: 600;
  color: #041b3c;
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

.form-input,
.form-select {
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
.form-select:focus {
  border-color: #0052cc;
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.08);
}

.form-input.has-error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
}

.live-preview-format {
  font-size: 11px;
  font-weight: 600;
  color: #059669;
  margin-top: 2px;
  background: #ecfdf5;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px dashed rgba(5, 150, 105, 0.15);
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

.btn-footer-save:hover {
  background: #059669;
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

.btn-footer-cancel:hover {
  background: #fafafb;
}
</style>
