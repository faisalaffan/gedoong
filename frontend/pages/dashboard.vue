<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const stats = [
  { label: 'Total Listing', value: '24', color: '#0052CC' },
  { label: 'Deal Bulan Ini', value: '8', color: '#16a34a' },
  { label: 'Follow-up Aktif', value: '12', color: '#e07b00' },
  { label: 'Komisi Bulan Ini', value: 'Rp 42jt', color: '#0052CC' },
]

const activities = [
  'Budi menambahkan listing baru "Rumah Minimalis Jaksel" — 2 jam lalu',
  'Siti (klien) pindah ke tahap Nego — 5 jam lalu',
  'Komisi Rp 5jt diproses untuk Apartemen Greenlake — kemarin',
  'Andi (klien) dijadwalkan follow-up besok — 8 jam lalu',
]
</script>

<template>
  <div class="dashboard-page">
    <h2 class="page-title">Dashboard</h2>

    <div class="stats-grid">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="stat-card"
      >
        <div class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card card-aktivitas">
        <h3 class="card-title">Aktivitas Terbaru</h3>
        <ul class="aktivitas-list">
          <li v-for="(item, i) in activities" :key="i" class="aktivitas-item">
            {{ item }}
          </li>
        </ul>
      </div>

      <div class="card card-pipeline">
        <h3 class="card-title">Pipeline Summary</h3>
        <div class="pipeline-summary">
          <div class="pipeline-stage"><span class="stage-label">Prospek</span><span class="stage-count">15</span></div>
          <div class="pipeline-stage"><span class="stage-label">Follow-up</span><span class="stage-count">12</span></div>
          <div class="pipeline-stage"><span class="stage-label">Nego</span><span class="stage-count">4</span></div>
          <div class="pipeline-stage"><span class="stage-label">Closing</span><span class="stage-count">3</span></div>
          <div class="pipeline-stage"><span class="stage-label">Deal</span><span class="stage-count">8</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
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
  grid-template-columns: repeat(4, 1fr);
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

.stat-value {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 12px;
  color: #737685;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.card {
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 12px;
  padding: 24px;
}

.card-title {
  font-size: 15px;
  font-weight: 700;
  color: #041b3c;
  margin-bottom: 16px;
}

.aktivitas-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.aktivitas-item {
  font-size: 13px;
  color: #434654;
  padding-left: 8px;
  border-left: 2px solid #e8ecf1;
  line-height: 1.5;
}

.pipeline-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pipeline-stage {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f5f7;
  border-radius: 6px;
  font-size: 13px;
}

.stage-label {
  color: #434654;
}

.stage-count {
  font-weight: 700;
  color: #0052CC;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
