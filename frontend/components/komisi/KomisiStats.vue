<script setup lang="ts">
import { useKomisiStore } from "~/stores/komisi";
import { formatRupiah } from "~/utils/format";

const store = useKomisiStore();

function formatJuta(value: number): string {
  const millions = value / 1000000;
  // If it's a whole number or has decimals
  if (millions % 1 === 0) {
    return `Rp ${millions.toFixed(0)}jt`;
  }
  return `Rp ${millions.toFixed(1).replace('.', ',')}jt`;
}
</script>

<template>
  <div class="stats-grid">
    <div class="stat-card stat-total">
      <div class="stat-icon-bg">💰</div>
      <div class="stat-info">
        <span class="stat-label">Total Komisi</span>
        <span class="stat-value">{{ formatJuta(store.totalKomisi) }}</span>
        <span class="stat-subtitle">{{ formatRupiah(store.totalKomisi) }}</span>
      </div>
    </div>

    <div class="stat-card stat-pending">
      <div class="stat-icon-bg">⏳</div>
      <div class="stat-info">
        <span class="stat-label">Pending</span>
        <span class="stat-value">{{ formatJuta(store.totalPending) }}</span>
        <span class="stat-subtitle">{{ formatRupiah(store.totalPending) }}</span>
      </div>
    </div>

    <div class="stat-card stat-dibayar">
      <div class="stat-icon-bg">✅</div>
      <div class="stat-info">
        <span class="stat-label">Sudah Dibayar</span>
        <span class="stat-value">{{ formatJuta(store.totalDibayar) }}</span>
        <span class="stat-subtitle">{{ formatRupiah(store.totalDibayar) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(4, 27, 60, 0.05);
}

.stat-icon-bg {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.stat-total .stat-icon-bg {
  background: #e8f0fe;
}
.stat-pending .stat-icon-bg {
  background: #fff7ed;
}
.stat-dibayar .stat-icon-bg {
  background: #ecfdf5;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 11px;
  font-weight: 700;
  color: #737685;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.stat-value {
  font-family: 'Outfit', sans-serif;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.2;
}

.stat-total .stat-value {
  color: #0052cc;
}
.stat-pending .stat-value {
  color: #e07b00;
}
.stat-dibayar .stat-value {
  color: #059669;
}

.stat-subtitle {
  font-size: 11px;
  color: #8b8e99;
  margin-top: 2px;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
