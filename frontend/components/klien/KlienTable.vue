<script setup lang="ts">
import { useKlienStore } from "~/stores/klien";

const store = useKlienStore();

function pipelineClass(stage: string) {
  if (stage === "Prospek") return "pipe-prospek";
  if (stage === "Follow-up") return "pipe-followup";
  if (stage === "Nego") return "pipe-nego";
  if (stage === "Closing") return "pipe-closing";
  return "";
}
</script>

<template>
  <div class="klien-main-content">
    <h2 class="page-title">
      Direktori Klien
      <span class="total-badge">
        (Total {{ store.kliens.length }} klien terdaftar)
      </span>
    </h2>

    <!-- Top Toolbar Control Area -->
    <div class="toolbar">
      <button class="btn-add" @click="store.openCreateDrawer">
        + Tambah Klien
      </button>
      <div class="toolbar-right">
        <input
          type="text"
          v-model="store.search"
          class="search-input"
          placeholder="Cari nama, kontak, properti..."
        />
        <select v-model="store.filterPipeline" class="filter-select">
          <option value="">Semua Pipeline</option>
          <option value="Prospek">Prospek</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Nego">Nego</option>
          <option value="Closing">Closing</option>
        </select>
      </div>
    </div>

    <!-- Table of Kliens -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Kontak</th>
            <th>Properti Terkait</th>
            <th>Pipeline</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="k in store.filteredKliens"
            :key="k.id"
            @click="store.openDrawer(k)"
            class="table-row-clickable"
          >
            <td class="cell-nama">
              <div class="klien-cell-content">
                <img v-if="k.foto_url" :src="k.foto_url" class="klien-avatar-img" />
                <div v-else class="klien-avatar">
                  {{ k.nama.charAt(0).toUpperCase() }}
                </div>
                <div class="klien-info">
                  <span class="klien-name">{{ k.nama }}</span>
                  <span class="klien-created" v-if="k.created_at">
                    Terdaftar: {{ new Date(k.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}
                  </span>
                </div>
              </div>
            </td>
            <td class="cell-kontak">
              <span class="kontak-text">{{ k.kontak || "-" }}</span>
            </td>
            <td>
              <span class="properti-text">{{ k.properti || "-" }}</span>
            </td>
            <td>
              <span class="pipe-badge" :class="pipelineClass(k.pipeline)">
                {{ k.pipeline }}
              </span>
            </td>
          </tr>
          <tr v-if="store.filteredKliens.length === 0">
            <td colspan="4" class="no-data">
              Tidak ada klien yang ditemukan di Supabase.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.klien-main-content {
  width: 100%;
}

.page-title {
  font-family: 'Outfit', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #041b3c;
  margin-bottom: 24px;
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

.klien-cell-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.klien-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e8f0fe 0%, #d2e3fc 100%);
  color: #1a73e8;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 -1px 0 rgba(0,0,0,0.05);
}

.klien-avatar-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #d7e2ff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.klien-info {
  display: flex;
  flex-direction: column;
}

.klien-name {
  font-weight: 600;
  color: #041b3c;
  font-size: 13.5px;
}

.klien-created {
  font-size: 11px;
  color: #8b8e99;
  margin-top: 2px;
}

.cell-kontak {
  font-family: monospace;
  font-size: 13px;
  color: #5a5e6f;
}

.properti-text {
  font-weight: 500;
  color: #383a45;
}

.pipe-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
}

.pipe-prospek {
  background: #e8f0fe;
  color: #0052cc;
  border: 1px solid rgba(0, 82, 204, 0.1);
}

.pipe-followup {
  background: #fff7ed;
  color: #e07b00;
  border: 1px solid rgba(224, 123, 0, 0.1);
}

.pipe-nego {
  background: #f3e8ff;
  color: #9333ea;
  border: 1px solid rgba(147, 51, 234, 0.1);
}

.pipe-closing {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid rgba(5, 150, 105, 0.1);
}

.no-data {
  padding: 40px 18px;
  text-align: center;
  color: #8b8e99;
  font-style: italic;
  font-size: 13px;
}
</style>
