<script setup lang="ts">
import { ref, computed } from "vue";
import { useKlienStore } from "~/stores/klien";

const store = useKlienStore();

const sortBy = ref<"nama" | "pipeline" | "created_at">("nama");
const sortOrder = ref<"asc" | "desc">("asc");

function pipelineClass(stage: string) {
  if (stage === "Prospek") return "pipe-prospek";
  if (stage === "Follow-up") return "pipe-followup";
  if (stage === "Nego") return "pipe-nego";
  if (stage === "Closing") return "pipe-closing";
  if (stage === "Deal") return "pipe-deal";
  return "";
}

function toggleSort(field: "nama" | "pipeline" | "created_at") {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = field;
    sortOrder.value = "asc";
  }
}

const sortedFilteredKliens = computed(() => {
  const list = [...store.filteredKliens];

  list.sort((a, b) => {
    let valA = "";
    let valB = "";

    if (sortBy.value === "nama") {
      valA = a.nama.toLowerCase();
      valB = b.nama.toLowerCase();
    } else if (sortBy.value === "pipeline") {
      valA = a.pipeline.toLowerCase();
      valB = b.pipeline.toLowerCase();
    } else if (sortBy.value === "created_at") {
      valA = a.created_at || "";
      valB = b.created_at || "";
    }

    if (valA < valB) return sortOrder.value === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });

  return list;
});

function exportToCSV() {
  const clients = sortedFilteredKliens.value;
  if (clients.length === 0) {
    alert("Tidak ada data klien untuk diekspor!");
    return;
  }

  const headers = ["Nama", "Telepon/WA", "Email", "Tipe Klien", "Sumber Klien", "Properti Terkait", "Pipeline Stage", "Tanggal Terdaftar"];
  const rows = clients.map((k) => [
    k.nama,
    k.kontak || "",
    k.email || "",
    k.tipe_klien || "Pembeli",
    k.sumber_klien || "Referral",
    k.properti || "",
    k.pipeline || "Prospek",
    k.created_at ? new Date(k.created_at).toLocaleDateString("id-ID") : "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((r) => r.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Direktori_Klien_Gedoong_${new Date().toISOString().substring(0, 10)}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
      <div class="toolbar-left">
        <button class="btn-add" @click="store.openCreateDrawer">
          + Tambah Klien
        </button>
        <button class="btn-export" @click="exportToCSV">
          📥 Ekspor CSV
        </button>
      </div>
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
          <option value="Deal">Deal</option>
        </select>
      </div>
    </div>

    <!-- Table of Kliens -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th @click="toggleSort('nama')" class="sortable-header">
              Nama
              <span class="sort-icon" v-if="sortBy === 'nama'">
                {{ sortOrder === "asc" ? "▲" : "▼" }}
              </span>
            </th>
            <th>Kontak & Email</th>
            <th>Info CRM</th>
            <th>Properti Terkait</th>
            <th @click="toggleSort('pipeline')" class="sortable-header">
              Pipeline
              <span class="sort-icon" v-if="sortBy === 'pipeline'">
                {{ sortOrder === "asc" ? "▲" : "▼" }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="k in sortedFilteredKliens"
            :key="k.id"
            @click="store.openDrawer(k)"
            class="table-row-clickable"
          >
            <td class="cell-nama">
              <div class="klien-cell-content">
                <img
                  v-if="k.foto_url"
                  :src="k.foto_url"
                  class="klien-avatar-img"
                />
                <div v-else class="klien-avatar">
                  {{ k.nama.charAt(0).toUpperCase() }}
                </div>
                <div class="klien-info">
                  <span class="klien-name">{{ k.nama }}</span>
                  <span class="klien-created" v-if="k.created_at">
                    Terdaftar:
                    {{
                      new Date(k.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    }}
                  </span>
                </div>
              </div>
            </td>
            <td class="cell-kontak">
              <div class="contact-email-wrapper">
                <span class="kontak-text">{{ k.kontak || "-" }}</span>
                <span class="email-text" v-if="k.email">{{ k.email }}</span>
                <span class="email-text-empty" v-else>-</span>
              </div>
            </td>
            <td>
              <div class="crm-badges-wrapper">
                <span 
                  class="badge-tipe" 
                  :class="'tipe-' + (k.tipe_klien || 'Pembeli').toLowerCase()"
                >
                  {{ k.tipe_klien || 'Pembeli' }}
                </span>
                <span class="badge-sumber">
                  {{ k.sumber_klien || 'Referral' }}
                </span>
              </div>
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
            <td colspan="5" class="no-data">
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
  font-family: "Outfit", sans-serif;
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
  font-family: "Inter", sans-serif;
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
  font-family: "Inter", sans-serif;
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
  font-family: "Inter", sans-serif;
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

.sortable-header {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease;
}

.sortable-header:hover {
  background-color: #f1f3f6;
  color: #041b3c;
}

.sort-icon {
  display: inline-block;
  margin-left: 4px;
  font-size: 9px;
  color: #0052cc;
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
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.05);
}

.klien-avatar-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #d7e2ff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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

.contact-email-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cell-kontak {
  font-family: var(--font-display), sans-serif;
  font-size: 13px;
  color: #5a5e6f;
}

.kontak-text {
  font-family: monospace;
  font-weight: 600;
}

.email-text {
  font-size: 11.5px;
  color: #0052cc;
  text-decoration: underline;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 160px;
}

.email-text-empty {
  font-size: 11.5px;
  color: #b5b7c0;
}

.crm-badges-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.badge-tipe {
  font-size: 9.5px;
  font-weight: 700;
  padding: 1.5px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.tipe-pembeli {
  background: #eff6ff;
  color: #1d4ed8;
}

.tipe-penyewa {
  background: #fdf2f8;
  color: #db2777;
}

.tipe-investor {
  background: #f3e8ff;
  color: #7e22ce;
}

.badge-sumber {
  font-size: 9px;
  font-weight: 600;
  color: #4b5563;
  background: #f3f4f6;
  padding: 1.5px 6px;
  border-radius: 4px;
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
  background: #fffbeb;
  color: #d97706;
  border: 1px solid rgba(217, 119, 6, 0.1);
}

.pipe-deal {
  background: #ecfdf5;
  color: #16a34a;
  border: 1px solid rgba(22, 163, 74, 0.1);
}

.no-data {
  padding: 40px 18px;
  text-align: center;
  color: #8b8e99;
  font-style: italic;
  font-size: 13px;
}
</style>
