<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { useKomisiStore } from "~/stores/komisi";
import { useKlienStore } from "~/stores/klien";
import { useDealStore } from "~/stores/deal";
import { useToast } from "~/composables/useToast";
import { formatRupiah } from "~/utils/format";
import type { Komisi, MetodeBayar } from "~/types/komisi";

const store = useKomisiStore();
const klienStore = useKlienStore();
const dealStore = useDealStore();
const { showToast } = useToast();

const form = ref<Partial<Komisi>>({
  properti: "",
  komisi: 0,
  tanggal: "",
  status: "Pending",
  klien_id: undefined,
  deal_id: undefined,
  komisi_persen: 0,
  tanggal_deal: "",
  tanggal_bayar: "",
  metode_bayar: "Transfer",
  catatan: "",
});

const errors = ref({
  properti: "",
  komisi: "",
  klien_id: "",
  deal_id: "",
  tanggal_deal: "",
  tanggal_bayar: "",
});

const isDeleting = ref(false);

// Ensure dependencies are loaded
onMounted(async () => {
  if (klienStore.kliens.length === 0) {
    await klienStore.fetchKliens();
  }
  if (dealStore.deals.length === 0) {
    await dealStore.fetchDeals();
  }
});

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
        klien_id: newVal.klien_id || undefined,
        deal_id: newVal.deal_id || undefined,
        komisi_persen: newVal.komisi_persen || 0,
        tanggal_deal: newVal.tanggal_deal || newVal.tanggal || "",
        tanggal_bayar: newVal.tanggal_bayar || "",
        metode_bayar: newVal.metode_bayar || "Transfer",
        catatan: newVal.catatan || "",
      };
      errors.value = {
        properti: "",
        komisi: "",
        klien_id: "",
        deal_id: "",
        tanggal_deal: "",
        tanggal_bayar: "",
      };
    }
  },
  { immediate: true },
);

// Filter deals depending on selected client
const filteredDealsForSelect = computed(() => {
  if (!form.value.klien_id) return [];
  return dealStore.deals.filter((d) => d.klien_id === Number(form.value.klien_id));
});

// Watch client selection to reset deal_id if it doesn't match the new list
watch(
  () => form.value.klien_id,
  (newKlienId, oldKlienId) => {
    if (oldKlienId !== undefined && newKlienId) {
      const isMatch = filteredDealsForSelect.value.some((d) => d.id === form.value.deal_id);
      if (!isMatch) {
        form.value.deal_id = undefined;
      }
    }
  }
);

// Get currently selected deal details
const selectedDealObj = computed(() => {
  if (!form.value.deal_id) return null;
  return dealStore.deals.find((d) => d.id === Number(form.value.deal_id));
});

// Format deal price for read-only preview
const dealPriceText = computed(() => {
  const deal = selectedDealObj.value;
  if (!deal || !deal.harga) return "-";
  return formatRupiah(deal.harga);
});

// Auto prefill properti title, % komisi and calculate commission value upon deal selection
watch(
  selectedDealObj,
  (deal) => {
    if (deal) {
      form.value.properti = deal.properti || deal.name || "";
      if (deal.komisi_persen) {
        form.value.komisi_persen = Number(deal.komisi_persen) || 0;
      }
      if (deal.tanggal_masuk) {
        form.value.tanggal_deal = deal.tanggal_masuk;
      }
    }
  }
);

// Dynamic commission amount auto calculation
watch(
  [() => form.value.komisi_persen, selectedDealObj],
  ([pct, deal]) => {
    if (deal && deal.harga && pct) {
      const gross = Math.round((Number(pct) / 100) * Number(deal.harga));
      form.value.komisi = gross;
    }
  }
);

// Formatted gross commission text
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

// Premium read-only dashboard metrics
const splitOfficeShare = computed(() => {
  if (!store.selectedKomisi) return 0;
  return Math.round(store.selectedKomisi.komisi * 0.4); // 40% office split
});

const splitAgentShare = computed(() => {
  if (!store.selectedKomisi) return 0;
  return Math.round(store.selectedKomisi.komisi * 0.6); // 60% agent split
});

const taxPPh21 = computed(() => {
  if (!store.selectedKomisi) return 0;
  return Math.round(store.selectedKomisi.komisi * 0.025); // 2.5% PPh 21 estimate
});

const netAfterTax = computed(() => {
  if (!store.selectedKomisi) return 0;
  return splitAgentShare.value - taxPPh21.value;
});

function validateForm() {
  let isValid = true;
  errors.value = {
    properti: "",
    komisi: "",
    klien_id: "",
    deal_id: "",
    tanggal_deal: "",
    tanggal_bayar: "",
  };

  if (!form.value.klien_id) {
    errors.value.klien_id = "Klien wajib dipilih";
    isValid = false;
  }

  if (!form.value.deal_id) {
    errors.value.deal_id = "Deal / Properti wajib dipilih";
    isValid = false;
  }

  if (!form.value.properti?.trim()) {
    errors.value.properti = "Nama properti wajib diisi";
    isValid = false;
  }

  const komisiNum = Number(form.value.komisi);
  if (isNaN(komisiNum) || komisiNum <= 0) {
    errors.value.komisi = "Jumlah komisi harus berupa angka positif";
    isValid = false;
  }

  if (!form.value.tanggal_deal) {
    errors.value.tanggal_deal = "Tanggal deal wajib dipilih";
    isValid = false;
  }

  if (form.value.status === "Dibayar" && !form.value.tanggal_bayar) {
    errors.value.tanggal_bayar = "Tanggal pembayaran wajib diisi jika status Dibayar";
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
    const payload = {
      properti: form.value.properti,
      komisi: Number(form.value.komisi),
      tanggal: form.value.tanggal_deal || form.value.tanggal,
      status: form.value.status,
      klien_id: Number(form.value.klien_id),
      deal_id: Number(form.value.deal_id),
      komisi_persen: Number(form.value.komisi_persen),
      tanggal_deal: form.value.tanggal_deal,
      tanggal_bayar: form.value.status === "Dibayar" ? form.value.tanggal_bayar : null,
      metode_bayar: form.value.metode_bayar as MetodeBayar,
      catatan: form.value.catatan,
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
        <!-- Financial Primary gross payout card -->
        <div class="financial-card">
          <div class="financial-icon-badge">💼</div>
          <span class="financial-label">JUMLAH KOMISI GROSS</span>
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

        <!-- Details grid -->
        <div class="details-section">
          <!-- Client name row -->
          <div class="detail-group" v-if="store.selectedKomisi.klien">
            <label class="detail-label">Klien Penerima / Terkait</label>
            <div class="client-detail-box">
              <span class="client-avatar-large">
                {{ store.selectedKomisi.klien.nama.charAt(0) }}
              </span>
              <div class="client-detail-info">
                <span class="client-detail-name">{{ store.selectedKomisi.klien.nama }}</span>
                <span class="client-detail-phone">{{ store.selectedKomisi.klien.kontak }}</span>
              </div>
              <a
                :href="`https://wa.me/62${store.selectedKomisi.klien.kontak.replace(/[^0-9]/g, '').substring(1)}`"
                target="_blank"
                class="btn-wa-link"
                title="Hubungi via WhatsApp"
              >
                💬 WA
              </a>
            </div>
          </div>

          <!-- Deal selection and property title -->
          <div class="detail-group">
            <label class="detail-label">Properti / Deal Terkait</label>
            <span class="detail-value text-semibold">
              {{ store.selectedKomisi.properti }}
            </span>
            <span class="deal-linked-tag" v-if="store.selectedKomisi.deal">
              Opportunity linked: {{ store.selectedKomisi.deal.name }}
            </span>
          </div>

          <!-- Pct calculation row -->
          <div class="detail-row-grid">
            <div class="detail-group">
              <label class="detail-label">Persentase Komisi</label>
              <span class="detail-value font-mono">
                {{ store.selectedKomisi.komisi_persen ? `${store.selectedKomisi.komisi_persen}%` : '-' }}
              </span>
            </div>
            
            <div class="detail-group">
              <label class="detail-label">Metode Pembayaran</label>
              <span class="detail-value">
                {{ store.selectedKomisi.metode_bayar || 'Transfer' }}
              </span>
            </div>
          </div>

          <!-- Dates transaction grid -->
          <div class="detail-row-grid">
            <div class="detail-group">
              <label class="detail-label">Tanggal Deal</label>
              <span class="detail-value font-mono">
                {{ formatDateId(store.selectedKomisi.tanggal_deal || store.selectedKomisi.tanggal) }}
              </span>
            </div>

            <div class="detail-group" v-if="store.selectedKomisi.tanggal_bayar">
              <label class="detail-label">Tanggal Pembayaran</label>
              <span class="detail-value font-mono date-paid-text">
                {{ formatDateId(store.selectedKomisi.tanggal_bayar) }}
              </span>
            </div>
          </div>

          <!-- Text area memo/description -->
          <div class="detail-group" v-if="store.selectedKomisi.catatan">
            <label class="detail-label">Catatan / Keterangan</label>
            <div class="notes-memo-box">
              {{ store.selectedKomisi.catatan }}
            </div>
          </div>

          <hr class="section-divider" />

          <!-- Premium Commission Split sharing and PPh display widgets -->
          <div class="financial-insights-box">
            <h5 class="insights-title">📊 Proyeksi Pembagian Keuangan</h5>
            
            <!-- Split metrics row -->
            <div class="split-insights-grid">
              <div class="split-col-box">
                <span class="split-col-label">🏢 Share Kantor (40%)</span>
                <span class="split-col-val">{{ formatRupiah(splitOfficeShare) }}</span>
              </div>
              <div class="split-col-box highlighted-share">
                <span class="split-col-label">👤 Share Agen Gross (60%)</span>
                <span class="split-col-val">{{ formatRupiah(splitAgentShare) }}</span>
              </div>
            </div>

            <!-- Tax estimate row -->
            <div class="tax-insight-row">
              <div class="tax-insight-item">
                <span class="tax-label">💸 Estimasi Potongan PPh 21 (2,5%)</span>
                <span class="tax-val">-{{ formatRupiah(taxPPh21) }}</span>
              </div>
              <div class="tax-insight-item net-payout-row">
                <span class="tax-label highlight-net">🎁 Bersih Diterima Agen</span>
                <span class="tax-val highlight-net-val">{{ formatRupiah(netAfterTax) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. EDIT / FORM MODE -->
      <div v-else class="edit-mode">
        <form @submit.prevent="handleSave" class="form-container">
          <!-- Client dropdown -->
          <div class="form-group">
            <label for="klien_id" class="form-label required">Pilih Klien</label>
            <select
              id="klien_id"
              v-model="form.klien_id"
              class="form-select"
              :class="{ 'has-error': errors.klien_id }"
            >
              <option :value="undefined" disabled>-- Pilih Klien Contact --</option>
              <option
                v-for="k in klienStore.kliens"
                :key="k.id"
                :value="k.id"
              >
                {{ k.nama }} ({{ k.kontak }})
              </option>
            </select>
            <span v-if="errors.klien_id" class="error-msg">{{ errors.klien_id }}</span>
          </div>

          <!-- Deal selector linked to chosen client -->
          <div class="form-group">
            <label for="deal_id" class="form-label required">Pilih Deal / Opportunity</label>
            <select
              id="deal_id"
              v-model="form.deal_id"
              class="form-select"
              :class="{ 'has-error': errors.deal_id }"
              :disabled="!form.klien_id"
            >
              <option :value="undefined" disabled>
                {{ form.klien_id ? '-- Pilih Deal Terkait --' : '-- Pilih klien terlebih dahulu --' }}
              </option>
              <option
                v-for="d in filteredDealsForSelect"
                :key="d.id"
                :value="d.id"
              >
                {{ d.name }} - ({{ d.properti }})
              </option>
            </select>
            <span v-if="errors.deal_id" class="error-msg">{{ errors.deal_id }}</span>
          </div>

          <!-- Form row for readonly Deal Price display -->
          <div class="form-group" v-if="selectedDealObj">
            <label class="form-label">Harga Deal Properti (Read-only)</label>
            <input
              type="text"
              :value="dealPriceText"
              class="form-input form-input-disabled"
              disabled
            />
          </div>

          <!-- Form row grid for Pct and Manual commission override input -->
          <div class="form-row-grid">
            <div class="form-group">
              <label for="komisi_persen" class="form-label">Persen Komisi (%)</label>
              <input
                type="number"
                step="0.1"
                id="komisi_persen"
                v-model="form.komisi_persen"
                class="form-input"
                placeholder="Contoh: 2.5"
              />
            </div>
            
            <div class="form-group">
              <label for="komisi" class="form-label required">Nilai Komisi (Rp)</label>
              <input
                type="number"
                id="komisi"
                v-model="form.komisi"
                class="form-input"
                :class="{ 'has-error': errors.komisi }"
                placeholder="Jumlah komisi final"
              />
            </div>
          </div>

          <!-- Payout formatting preview alert -->
          <div v-if="liveKomisiFormat" class="live-preview-format">
            ✨ Preview: {{ liveKomisiFormat }}
          </div>
          <span v-if="errors.komisi" class="error-msg">{{ errors.komisi }}</span>

          <hr class="section-divider" />

          <!-- Form row grid for Deal Date and Pay Date -->
          <div class="form-row-grid">
            <div class="form-group">
              <label for="tanggal_deal" class="form-label required">Tanggal Deal</label>
              <input
                type="date"
                id="tanggal_deal"
                v-model="form.tanggal_deal"
                class="form-input"
                :class="{ 'has-error': errors.tanggal_deal }"
              />
              <span v-if="errors.tanggal_deal" class="error-msg">{{ errors.tanggal_deal }}</span>
            </div>

            <div class="form-group">
              <label for="tanggal_bayar" class="form-label">Tanggal Dibayar</label>
              <input
                type="date"
                id="tanggal_bayar"
                v-model="form.tanggal_bayar"
                class="form-input"
                :class="{ 'has-error': errors.tanggal_bayar }"
                :disabled="form.status !== 'Dibayar'"
              />
              <span v-if="errors.tanggal_bayar" class="error-msg">{{ errors.tanggal_bayar }}</span>
            </div>
          </div>

          <!-- Pay method dropdown and Status selector -->
          <div class="form-row-grid">
            <div class="form-group">
              <label for="metode_bayar" class="form-label">Metode Pembayaran</label>
              <select id="metode_bayar" v-model="form.metode_bayar" class="form-select">
                <option value="Transfer">Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Cek">Cek</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div class="form-group">
              <label for="status" class="form-label">Status Keuangan</label>
              <select id="status" v-model="form.status" class="form-select">
                <option value="Pending">Pending</option>
                <option value="Diproses">Diproses</option>
                <option value="Dibayar">Dibayar</option>
              </select>
            </div>
          </div>

          <!-- Catatan / Memo area -->
          <div class="form-group">
            <label for="catatan" class="form-label">Catatan / Keterangan Tambahan</label>
            <textarea
              id="catatan"
              v-model="form.catatan"
              class="form-textarea"
              rows="3"
              placeholder="Tambahkan split co-broking, info co-agen, potongan pajak khusus..."
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

.detail-row-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.detail-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-label {
  font-size: 11px;
  font-weight: 750;
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
  font-size: 14.5px;
}

.font-mono {
  font-family: monospace;
  font-weight: 600;
  color: #111827;
  font-size: 13px;
}

.date-paid-text {
  color: #059669;
}

.deal-linked-tag {
  font-size: 11px;
  font-weight: 600;
  color: #3b82f6;
  background: #eff6ff;
  padding: 3px 8px;
  border-radius: 6px;
  align-self: flex-start;
  margin-top: 2px;
}

.notes-memo-box {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.5;
  white-space: pre-line;
}

/* Client Details box styling */
.client-detail-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 14px;
}

.client-avatar-large {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #dbeafe;
  color: #1e40af;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  text-transform: uppercase;
}

.client-detail-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.client-detail-name {
  font-weight: 700;
  color: #0f172a;
  font-size: 13.5px;
}

.client-detail-phone {
  font-family: monospace;
  font-size: 11.5px;
  color: #64748b;
  margin-top: 1px;
}

.btn-wa-link {
  padding: 6px 12px;
  background: #25d366;
  color: white;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.15s ease;
}

.btn-wa-link:hover {
  background: #128c7e;
  transform: scale(1.03);
}

.section-divider {
  border: 0;
  border-top: 1px solid #f1f5f9;
  margin: 10px 0;
}

/* Premium Proyeksi Finansial Styling */
.financial-insights-box {
  background: #fafafb;
  border: 1px solid #e8ecf1;
  border-radius: 12px;
  padding: 16px;
}

.insights-title {
  margin: 0 0 14px 0;
  font-size: 13px;
  font-weight: 700;
  color: #041b3c;
}

.split-insights-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 14px;
}

.split-col-box {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.highlighted-share {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.split-col-label {
  font-size: 10px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

.highlighted-share .split-col-label {
  color: #166534;
}

.split-col-val {
  font-family: "Outfit", sans-serif;
  font-size: 14px;
  font-weight: 800;
  color: #1e293b;
}

.highlighted-share .split-col-val {
  color: #15803d;
}

.tax-insight-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px dashed #e2e8f0;
  padding-top: 12px;
}

.tax-insight-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
}

.tax-label {
  font-weight: 500;
}

.tax-val {
  font-weight: 600;
  color: #b91c1c;
}

.net-payout-row {
  border-top: 1px solid #e2e8f0;
  padding-top: 8px;
  margin-top: 2px;
}

.highlight-net {
  color: #041b3c;
  font-weight: 700;
  font-size: 12.5px;
}

.highlight-net-val {
  color: #059669;
  font-size: 14.5px;
  font-family: "Outfit", sans-serif;
  font-weight: 800;
}

/* Edit Mode Styling */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

.form-textarea {
  resize: vertical;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: #0052cc;
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.08);
}

.form-input.has-error,
.form-select.has-error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
}

.form-input-disabled {
  background: #f1f5f9 !important;
  color: #64748b !important;
  border-color: #cbd5e1 !important;
  cursor: not-allowed;
  font-weight: 600;
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
  align-self: flex-start;
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
