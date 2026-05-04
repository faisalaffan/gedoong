<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

interface ListingItem {
  properti: string
  tipe: string
  harga: string
  status: string
}

const listings: ListingItem[] = [
  { properti: 'Rumah Minimalis Jaksel', tipe: 'Jual', harga: 'Rp 850jt', status: 'Aktif' },
  { properti: 'Apartemen Greenlake', tipe: 'Sewa', harga: 'Rp 4.5jt/bln', status: 'Terjual' },
  { properti: 'Ruko Mangga Dua', tipe: 'Jual', harga: 'Rp 1.2M', status: 'Draft' },
  { properti: 'Villa Puncak', tipe: 'Jual', harga: 'Rp 2.5M', status: 'Aktif' },
  { properti: 'Kost Exclusive Depok', tipe: 'Sewa', harga: 'Rp 2jt/bln', status: 'Aktif' },
]

const search = ref('')
const filterTipe = ref('')

function statusClass(status: string) {
  if (status === 'Aktif') return 'status-aktif'
  if (status === 'Terjual') return 'status-terjual'
  if (status === 'Draft') return 'status-draft'
  return ''
}
</script>

<template>
  <div class="listing-page">
    <h2 class="page-title">Manajemen Listing</h2>

    <div class="toolbar">
      <button class="btn-add">+ Tambah Listing</button>
      <div class="toolbar-right">
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Cari listing..."
        />
        <select v-model="filterTipe" class="filter-select">
          <option value="">Semua Tipe</option>
          <option value="Jual">Jual</option>
          <option value="Sewa">Sewa</option>
        </select>
      </div>
    </div>

    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Properti</th>
            <th>Tipe</th>
            <th>Harga</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(l, i) in listings" :key="i">
            <td class="cell-properti">{{ l.properti }}</td>
            <td>{{ l.tipe }}</td>
            <td class="cell-harga">{{ l.harga }}</td>
            <td><span class="status-badge" :class="statusClass(l.status)">{{ l.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.listing-page {
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
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
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
  white-space: nowrap;
}

.btn-add:hover {
  background: #003d9b;
}

.toolbar-right {
  display: flex;
  gap: 8px;
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
  width: 180px;
  background: #fff;
}

.search-input:focus {
  border-color: #0052CC;
}

.filter-select {
  height: 38px;
  padding: 0 10px;
  border: 1px solid #d7e2ff;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: #041b3c;
  background: #fff;
  cursor: pointer;
  outline: none;
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

.cell-properti {
  font-weight: 600;
  color: #041b3c;
}

.cell-harga {
  font-weight: 500;
}

.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.status-aktif {
  background: #e8f0fe;
  color: #0052CC;
}

.status-terjual {
  background: #dcfce7;
  color: #16a34a;
}

.status-draft {
  background: #fff7ed;
  color: #e07b00;
}
</style>
