<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { db, type Komisi } from "~/utils/db";

definePageMeta({ layout: "dashboard" });

const komisiList = ref<Komisi[]>([]);

onMounted(async () => {
  komisiList.value = await db.komisi.toArray();
});

const parseKomisi = (str: string) => {
  // 'Rp 17jt' -> 17
  return parseInt(str.replace(/\D/g, "")) || 0;
};

const totalKomisi = computed(() => {
  return komisiList.value.reduce(
    (acc, curr) => acc + parseKomisi(curr.komisi),
    0,
  );
});

const totalPending = computed(() => {
  return komisiList.value
    .filter((k) => k.status === "Pending")
    .reduce((acc, curr) => acc + parseKomisi(curr.komisi), 0);
});

const totalDibayar = computed(() => {
  return komisiList.value
    .filter((k) => k.status === "Dibayar")
    .reduce((acc, curr) => acc + parseKomisi(curr.komisi), 0);
});

function statusClass(status: string) {
  if (status === "Dibayar") return "status-dibayar";
  if (status === "Diproses") return "status-diproses";
  if (status === "Pending") return "status-pending";
  return "";
}
</script>

<template>
  <div class="komisi-page">
    <h2 class="page-title">Komisi & Keuangan</h2>

    <div class="stats-grid">
      <div class="stat-card stat-total">
        <div class="stat-label">Total Komisi</div>
        <div class="stat-value">Rp {{ totalKomisi }}jt</div>
      </div>
      <div class="stat-card stat-pending">
        <div class="stat-label">Pending</div>
        <div class="stat-value">Rp {{ totalPending }}jt</div>
      </div>
      <div class="stat-card stat-dibayar">
        <div class="stat-label">Sudah Dibayar</div>
        <div class="stat-value">Rp {{ totalDibayar }}jt</div>
      </div>
    </div>

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
          <tr v-for="(k, i) in komisiList" :key="i">
            <td class="cell-properti">{{ k.properti }}</td>
            <td class="cell-komisi">{{ k.komisi }}</td>
            <td>{{ k.tanggal }}</td>
            <td>
              <span class="status-badge" :class="statusClass(k.status)">{{
                k.status
              }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.komisi-page {
  max-width: 1100px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #041b3c;
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #737685;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
}

.stat-total .stat-value {
  color: #0052cc;
}
.stat-pending .stat-value {
  color: #e07b00;
}
.stat-dibayar .stat-value {
  color: #16a34a;
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

.cell-komisi {
  font-weight: 500;
}

.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.status-dibayar {
  background: #dcfce7;
  color: #16a34a;
}

.status-diproses {
  background: #e8f0fe;
  color: #0052cc;
}

.status-pending {
  background: #fff7ed;
  color: #e07b00;
}
</style>
