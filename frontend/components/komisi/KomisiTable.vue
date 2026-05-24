<script setup lang="ts">
import { ref, computed } from "vue";
import { useKomisiStore } from "~/stores/komisi";
import { formatRupiah } from "~/utils/format";

const store = useKomisiStore();
const filterPeriode = ref("");

function formatJuta(value: number): string {
  const millions = value / 1000000;
  if (millions % 1 === 0) {
    return `Rp ${millions.toFixed(0)}jt`;
  }
  return `Rp ${millions.toFixed(1).replace('.', ',')}jt`;
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

function statusClass(status: string) {
  if (status === "Dibayar") return "status-dibayar";
  if (status === "Diproses") return "status-diproses";
  if (status === "Pending") return "status-pending";
  return "";
}

// Local computed filtering by date range periods
const customFilteredKomisiList = computed(() => {
  const list = store.filteredKomisiList;
  if (!filterPeriode.value) return list;

  const now = new Date();
  const currentMonth = now.getMonth(); // 0-indexed
  const currentYear = now.getFullYear();

  return list.filter((item) => {
    const checkDateStr = item.tanggal_deal || item.tanggal;
    if (!checkDateStr) return false;
    
    const itemDate = new Date(checkDateStr);
    const itemMonth = itemDate.getMonth();
    const itemYear = itemDate.getFullYear();

    if (filterPeriode.value === "bulan-ini") {
      return itemMonth === currentMonth && itemYear === currentYear;
    }
    if (filterPeriode.value === "kuartal-ini") {
      const currentQuarter = Math.floor(currentMonth / 3);
      const itemQuarter = Math.floor(itemMonth / 3);
      return itemQuarter === currentQuarter && itemYear === currentYear;
    }
    if (filterPeriode.value === "tahun-ini") {
      return itemYear === currentYear;
    }
    return true;
  });
});

// CSV Export logic
function exportCSV() {
  const dataToExport = customFilteredKomisiList.value;
  if (dataToExport.length === 0) {
    alert("Tidak ada data komisi untuk diekspor!");
    return;
  }

  // Headers
  const headers = ["ID", "Nama Properti", "Klien", "Nilai Komisi", "% Komisi", "Tanggal Deal", "Tanggal Dibayar", "Metode Bayar", "Status", "Catatan"];
  
  // Rows
  const rows = dataToExport.map((k) => [
    k.id || "",
    k.properti.replace(/"/g, '""'),
    (k.klien?.nama || "-").replace(/"/g, '""'),
    k.komisi,
    k.komisi_persen || 0,
    k.tanggal_deal || k.tanggal || "",
    k.tanggal_bayar || "",
    k.metode_bayar || "Transfer",
    k.status,
    (k.catatan || "").replace(/"/g, '""')
  ]);

  // Combine CSV content
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((val) => `"${val}"`).join(","))
  ].join("\n");

  // Create temporary link and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Laporan_Komisi_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<template>
  <div class="komisi-main-content">
    <div class="header-section">
      <h2 class="page-title">
        Komisi & Keuangan
        <span class="total-badge">
          (Total {{ customFilteredKomisiList.length }} catatan transaksi)
        </span>
      </h2>
    </div>

    <!-- Top Toolbar Control Area -->
    <div class="toolbar">
      <div class="toolbar-left">
        <button class="btn-add" @click="store.openCreateDrawer">
          + Catat Komisi
        </button>
        <button class="btn-export" @click="exportCSV">
          ⬇️ Ekspor CSV
        </button>
      </div>

      <div class="toolbar-right">
        <!-- Search bar -->
        <input
          type="text"
          v-model="store.search"
          class="search-input"
          placeholder="Cari properti atau klien..."
        />

        <!-- Period date range selector -->
        <select v-model="filterPeriode" class="filter-select">
          <option value="">Semua Periode</option>
          <option value="bulan-ini">Bulan Ini</option>
          <option value="kuartal-ini">Kuartal Ini</option>
          <option value="tahun-ini">Tahun Ini</option>
        </select>

        <!-- Status filter -->
        <select v-model="store.filterStatus" class="filter-select">
          <option value="">Semua Status</option>
          <option value="Pending">Pending</option>
          <option value="Diproses">Diproses</option>
          <option value="Dibayar">Dibayar</option>
        </select>
      </div>
    </div>

    <!-- Table of Commissions -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Properti / Deal</th>
            <th>Klien</th>
            <th>Komisi (% / Gross)</th>
            <th>Tanggal Deal</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="k in customFilteredKomisiList"
            :key="k.id"
            @click="store.openDrawer(k)"
            class="table-row-clickable"
          >
            <td class="cell-properti">
              <div class="properti-cell-content">
                <span class="properti-icon">🏢</span>
                <span class="properti-name">{{ k.properti }}</span>
              </div>
            </td>
            
            <td class="cell-klien">
              <div class="klien-cell-content" v-if="k.klien">
                <span class="klien-avatar">{{ k.klien.nama.charAt(0) }}</span>
                <div class="klien-info-col">
                  <span class="klien-name-txt">{{ k.klien.nama }}</span>
                  <span class="klien-phone-txt">{{ k.klien.kontak }}</span>
                </div>
              </div>
              <span class="no-klien" v-else>-</span>
            </td>

            <td class="cell-komisi">
              <div class="komisi-value-group">
                <span class="komisi-short">
                  {{ formatJuta(k.komisi) }}
                  <span class="komisi-pct-tag" v-if="k.komisi_persen">
                    ({{ k.komisi_persen }}%)
                  </span>
                </span>
                <span class="komisi-full">{{ formatRupiah(k.komisi) }}</span>
              </div>
            </td>

            <td class="cell-tanggal">
              {{ formatDateId(k.tanggal_deal || k.tanggal) }}
            </td>
            
            <td>
              <span class="status-badge" :class="statusClass(k.status)">
                {{ k.status }}
              </span>
            </td>
          </tr>
          
          <tr v-if="customFilteredKomisiList.length === 0">
            <td colspan="5" class="no-data">
              Tidak ada catatan komisi yang ditemukan di Supabase.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.komisi-main-content {
  width: 100%;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-family: 'Outfit', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #041b3c;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.total-badge {
  font-size: 13px;
  font-weight: 500;
  color: #737685;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-add {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #0052cc 0%, #0040a1 100%);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 82, 204, 0.15);
  transition: all 0.2s ease;
}

.btn-add:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 82, 204, 0.25);
  background: linear-gradient(135deg, #0040a1 0%, #003080 100%);
}

.btn-export {
  padding: 10px 18px;
  border: 1px solid #d7e2ff;
  border-radius: 8px;
  background: #fff;
  color: #0052cc;
  font-size: 13px;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 2px 4px rgba(220, 225, 240, 0.1);
}

.btn-export:hover {
  background: #f0f4ff;
  border-color: #0052cc;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  height: 38px;
  padding: 0 16px;
  border: 1px solid #d7e2ff;
  border-radius: 8px;
  font-size: 13px;
  font-family: 'Inter', sans-serif;
  color: #041b3c;
  outline: none;
  width: 240px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(220, 225, 240, 0.2);
  transition: all 0.15s ease;
}

.search-input:focus {
  border-color: #0052cc;
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
}

.filter-select {
  height: 38px;
  padding: 0 12px;
  border: 1px solid #d7e2ff;
  border-radius: 8px;
  font-size: 13px;
  font-family: 'Inter', sans-serif;
  color: #041b3c;
  outline: none;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(220, 225, 240, 0.2);
  transition: all 0.15s ease;
}

.filter-select:focus {
  border-color: #0052cc;
}

.table-card {
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table th {
  text-align: left;
  padding: 14px 18px;
  color: #737685;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e8ecf1;
  background: #fafafb;
}

.data-table td {
  padding: 16px 18px;
  border-bottom: 1px solid #f2f5f9;
  color: #434654;
  vertical-align: middle;
}

.table-row-clickable {
  cursor: pointer;
  transition: background 0.15s ease;
}

.table-row-clickable:hover {
  background: #fafcff;
}

.properti-cell-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.properti-icon {
  font-size: 16px;
}

.properti-name {
  font-weight: 600;
  color: #041b3c;
  font-size: 13.5px;
}

/* Klien Column Styling */
.klien-cell-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.klien-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e0f2fe;
  color: #0369a1;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  text-transform: uppercase;
}

.klien-info-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.klien-name-txt {
  font-weight: 600;
  color: #1f2937;
  font-size: 13px;
}

.klien-phone-txt {
  font-family: monospace;
  font-size: 11px;
  color: #6b7280;
}

.no-klien {
  color: #9ca3af;
  font-style: italic;
}

.cell-komisi {
  font-size: 13px;
}

.komisi-value-group {
  display: flex;
  flex-direction: column;
}

.komisi-short {
  font-weight: 700;
  color: #041b3c;
  display: flex;
  align-items: center;
  gap: 6px;
}

.komisi-pct-tag {
  font-size: 11px;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  padding: 1px 5px;
  border-radius: 4px;
}

.komisi-full {
  font-size: 11px;
  color: #8b8e99;
  margin-top: 1px;
}

.cell-tanggal {
  color: #4b5563;
  font-weight: 500;
}

.status-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
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

.no-data {
  padding: 40px 18px;
  text-align: center;
  color: #8b8e99;
  font-style: italic;
  font-size: 13px;
}
</style>
