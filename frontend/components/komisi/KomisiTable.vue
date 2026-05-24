<script setup lang="ts">
import { useKomisiStore } from "~/stores/komisi";
import { formatRupiah } from "~/utils/format";

const store = useKomisiStore();

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
</script>

<template>
  <div class="komisi-main-content">
    <div class="header-section">
      <h2 class="page-title">
        Komisi & Keuangan
        <span class="total-badge">
          (Total {{ store.komisiList.length }} catatan transaksi)
        </span>
      </h2>
    </div>

    <!-- Top Toolbar Control Area -->
    <div class="toolbar">
      <button class="btn-add" @click="store.openCreateDrawer">
        + Catat Komisi
      </button>
      <div class="toolbar-right">
        <input
          type="text"
          v-model="store.search"
          class="search-input"
          placeholder="Cari nama properti..."
        />
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
            <th>Properti</th>
            <th>Komisi</th>
            <th>Tanggal</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="k in store.filteredKomisiList"
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
            <td class="cell-komisi">
              <div class="komisi-value-group">
                <span class="komisi-short">{{ formatJuta(k.komisi) }}</span>
                <span class="komisi-full">{{ formatRupiah(k.komisi) }}</span>
              </div>
            </td>
            <td class="cell-tanggal">
              {{ formatDateId(k.tanggal) }}
            </td>
            <td>
              <span class="status-badge" :class="statusClass(k.status)">
                {{ k.status }}
              </span>
            </td>
          </tr>
          <tr v-if="store.filteredKomisiList.length === 0">
            <td colspan="4" class="no-data">
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
  width: 260px;
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
