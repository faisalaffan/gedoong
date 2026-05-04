<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

interface KlienItem {
  nama: string
  kontak: string
  properti: string
  pipeline: string
}

const kliens: KlienItem[] = [
  { nama: 'John Doe', kontak: '0812-3456-7890', properti: 'Rumah Minimalis Jaksel', pipeline: 'Prospek' },
  { nama: 'Sarah Lee', kontak: '0856-7890-1234', properti: 'Apartemen Greenlake', pipeline: 'Nego' },
  { nama: 'Andi Prasetyo', kontak: '0878-1234-5678', properti: 'Ruko Mangga Dua', pipeline: 'Follow-up' },
  { nama: 'Rina Wijaya', kontak: '0813-9876-5432', properti: 'Ruko BSD', pipeline: 'Prospek' },
]

const search = ref('')

function pipelineClass(stage: string) {
  if (stage === 'Prospek') return 'pipe-prospek'
  if (stage === 'Follow-up') return 'pipe-followup'
  if (stage === 'Nego') return 'pipe-nego'
  if (stage === 'Closing') return 'pipe-closing'
  return ''
}
</script>

<template>
  <div class="klien-page">
    <h2 class="page-title">Direktori Klien</h2>

    <div class="toolbar">
      <button class="btn-add">+ Tambah Klien</button>
      <input
        v-model="search"
        type="text"
        class="search-input"
        placeholder="Cari klien..."
      />
    </div>

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
          <tr v-for="(k, i) in kliens" :key="i">
            <td class="cell-nama">{{ k.nama }}</td>
            <td>{{ k.kontak }}</td>
            <td>{{ k.properti }}</td>
            <td><span class="pipe-badge" :class="pipelineClass(k.pipeline)">{{ k.pipeline }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.klien-page {
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
  gap: 12px;
  margin-bottom: 20px;
}

.btn-add {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: #0052CC;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-add:hover {
  background: #003d9b;
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
  width: 200px;
  background: #fff;
}

.search-input:focus {
  border-color: #0052CC;
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

.cell-nama {
  font-weight: 600;
  color: #041b3c;
}

.pipe-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.pipe-prospek {
  background: #e8f0fe;
  color: #0052CC;
}

.pipe-followup {
  background: #fff7ed;
  color: #e07b00;
}

.pipe-nego {
  background: #f3e8ff;
  color: #9333ea;
}

.pipe-closing {
  background: #fce7f3;
  color: #dc2626;
}
</style>
