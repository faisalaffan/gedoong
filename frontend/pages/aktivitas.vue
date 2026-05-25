<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({ layout: "dashboard" })

const activities = ref<any[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const selectedType = ref('All')
const selectedPeriod = ref('All')

const supabase = useSupabaseClient()

function getActivityType(desc: string) {
  const text = desc.toLowerCase()
  if (text.includes('menambahkan') || text.includes('membuat') || text.includes('mencatat')) {
    return {
      type: 'Tambah',
      label: 'Tambah',
      color: '#16a34a',
      bg: '#f0fdf4',
      icon: '✨'
    }
  }
  if (text.includes('menghapus')) {
    return {
      type: 'Hapus',
      label: 'Hapus',
      color: '#dc2626',
      bg: '#fef2f2',
      icon: '🗑️'
    }
  }
  if (text.includes('memindahkan') || text.includes('pindah')) {
    return {
      type: 'Pipeline',
      label: 'Pipeline',
      color: '#ea580c',
      bg: '#fff7ed',
      icon: '📋'
    }
  }
  return {
    type: 'Update',
    label: 'Update',
    color: '#0052cc',
    bg: '#eff6ff',
    icon: '📝'
  }
}

async function fetchActivities() {
  isLoading.value = true
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100) // Fetch top 100 activities for audit list

    if (error) throw error
    activities.value = data || []
  } catch (error) {
    console.error('Error fetching activities:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchActivities()
})

const filteredActivities = computed(() => {
  return activities.value.filter(item => {
    // 1. Search Query Filter
    const matchesSearch = item.description.toLowerCase().includes(searchQuery.value.toLowerCase())

    // 2. Type Filter
    const parsed = getActivityType(item.description)
    const matchesType = selectedType.value === 'All' || parsed.type === selectedType.value

    // 3. Period Filter
    let matchesPeriod = true
    if (selectedPeriod.value !== 'All') {
      const now = new Date()
      const activityDate = new Date(item.created_at)
      const diffTime = Math.abs(now.getTime() - activityDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (selectedPeriod.value === 'Today') {
        matchesPeriod = diffDays <= 1 && now.getDate() === activityDate.getDate()
      } else if (selectedPeriod.value === 'Week') {
        matchesPeriod = diffDays <= 7
      } else if (selectedPeriod.value === 'Month') {
        matchesPeriod = diffDays <= 30
      }
    }

    return matchesSearch && matchesType && matchesPeriod
  })
})

// Metrics counts for stats bar
const stats = computed(() => {
  const total = filteredActivities.value.length
  let addCount = 0
  let updateCount = 0
  let deleteCount = 0
  
  filteredActivities.value.forEach(item => {
    const parsed = getActivityType(item.description)
    if (parsed.type === 'Tambah') addCount++
    if (parsed.type === 'Update' || parsed.type === 'Pipeline') updateCount++
    if (parsed.type === 'Hapus') deleteCount++
  })

  return { total, addCount, updateCount, deleteCount }
})

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDateFull(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: 'long',
    day: "numeric",
    month: "long",
    year: "numeric"
  })
}
</script>

<template>
  <div class="activities-page">
    <div class="page-header">
      <div class="header-left">
        <NuxtLink to="/dashboard" class="btn-back">← Kembali ke Dashboard</NuxtLink>
        <h2 class="page-title">Log Aktivitas Sistem</h2>
        <p class="page-subtitle">Daftar lengkap audit log aktivitas dan riwayat operasional CRM Anda.</p>
      </div>
      <button @click="fetchActivities" class="btn-refresh" :disabled="isLoading">
        <span class="refresh-icon" :class="{ 'spinning': isLoading }">🔄</span>
        <span>Muat Ulang</span>
      </button>
    </div>

    <!-- Stats Bar -->
    <div class="stats-bar">
      <div class="stat-item bg-total">
        <span class="stat-number">{{ stats.total }}</span>
        <span class="stat-name">Total Log</span>
      </div>
      <div class="stat-item bg-add">
        <span class="stat-number" style="color: #16a34a">{{ stats.addCount }}</span>
        <span class="stat-name">Penambahan</span>
      </div>
      <div class="stat-item bg-update">
        <span class="stat-number" style="color: #0052cc">{{ stats.updateCount }}</span>
        <span class="stat-name">Perubahan</span>
      </div>
      <div class="stat-item bg-delete">
        <span class="stat-number" style="color: #dc2626">{{ stats.deleteCount }}</span>
        <span class="stat-name">Penghapusan</span>
      </div>
    </div>

    <!-- Filters Area -->
    <div class="filters-card glass-panel">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari deskripsi aktivitas..." 
          class="filter-search"
        />
      </div>

      <div class="filter-dropdowns">
        <div class="filter-group">
          <label class="filter-label">Tipe Aksi</label>
          <select v-model="selectedType" class="filter-select">
            <option value="All">Semua Aksi</option>
            <option value="Tambah">✨ Penambahan</option>
            <option value="Update">📝 Perubahan</option>
            <option value="Pipeline">📋 Pergerakan Pipeline</option>
            <option value="Hapus">🗑️ Penghapusan</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Periode</label>
          <select v-model="selectedPeriod" class="filter-select">
            <option value="All">Semua Waktu</option>
            <option value="Today">Hari Ini</option>
            <option value="Week">7 Hari Terakhir</option>
            <option value="Month">Bulan Ini</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Main List/Timeline -->
    <div class="timeline-container">
      <div v-if="isLoading" class="skeleton-wrapper">
        <div v-for="n in 5" :key="n" class="skeleton-item">
          <div class="skeleton-circle"></div>
          <div class="skeleton-lines">
            <div class="skeleton-line skeleton-title"></div>
            <div class="skeleton-line skeleton-text"></div>
          </div>
        </div>
      </div>

      <div v-else-if="filteredActivities.length === 0" class="empty-state">
        <span class="empty-emoji">🕵️‍♂️</span>
        <h3>Tidak Ada Log Aktivitas</h3>
        <p>Tidak ditemukan aktivitas yang cocok dengan kriteria pencarian atau filter Anda.</p>
        <button 
          v-if="searchQuery || selectedType !== 'All' || selectedPeriod !== 'All'"
          @click="searchQuery = ''; selectedType = 'All'; selectedPeriod = 'All'" 
          class="btn-reset"
        >
          Reset Filter
        </button>
      </div>

      <ul v-else class="activities-detailed-timeline">
        <li v-for="item in filteredActivities" :key="item.id" class="detailed-item">
          <div class="detailed-dot-column">
            <div 
              class="detailed-dot" 
              :style="{ backgroundColor: getActivityType(item.description).color }"
            >
              {{ getActivityType(item.description).icon }}
            </div>
            <div class="detailed-line"></div>
          </div>

          <div class="detailed-content-card">
            <div class="card-meta">
              <span 
                class="detailed-badge"
                :style="{ 
                  color: getActivityType(item.description).color,
                  backgroundColor: getActivityType(item.description).bg
                }"
              >
                {{ getActivityType(item.description).label }}
              </span>
              <span class="detailed-time">
                {{ formatTime(item.created_at) }}
              </span>
            </div>
            <p class="detailed-desc">{{ item.description }}</p>
            <span class="detailed-date">
              📅 {{ formatDateFull(item.created_at) }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.activities-page {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.btn-back {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
  display: inline-block;
  margin-bottom: 8px;
  transition: color var(--transition-fast);
}

.btn-back:hover {
  color: var(--primary-hover);
}

.page-title {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 800;
  color: #041b3c;
  margin: 0 0 6px 0;
}

.page-subtitle {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
  font-weight: 500;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  background: white;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-medium);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.btn-refresh:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
  box-shadow: 0 4px 12px rgba(0, 82, 204, 0.08);
}

.refresh-icon {
  font-size: 14px;
  display: inline-block;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Stats Bar */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: var(--radius-md);
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);
}

.stat-number {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 800;
  color: #041b3c;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-name {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.bg-total { border-left: 4px solid var(--text-medium); }
.bg-add { border-left: 4px solid #16a34a; }
.bg-update { border-left: 4px solid #0052cc; }
.bg-delete { border-left: 4px solid #dc2626; }

/* Filters Card */
.filters-card {
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 32px;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
  box-shadow: var(--shadow-sm);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  color: var(--text-muted);
  font-size: 14px;
}

.filter-search {
  width: 100%;
  height: 44px;
  padding: 0 16px 0 40px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  outline: none;
  font-family: var(--font-body);
  font-size: 14px;
  transition: all var(--transition-fast);
}

.filter-search:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-glow);
}

.filter-dropdowns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  color: var(--text-medium);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.filter-select {
  height: 44px;
  padding: 0 12px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  background: #fff;
  outline: none;
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--text-medium);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-select:focus {
  border-color: var(--primary);
}

/* Detailed Timeline Styling */
.timeline-container {
  margin-top: 10px;
}

.activities-detailed-timeline {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.detailed-item {
  display: flex;
  gap: 20px;
}

.detailed-dot-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.detailed-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: white;
  z-index: 2;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
}

.detailed-line {
  width: 2px;
  flex-grow: 1;
  background: #e8ecf1;
  margin-top: 4px;
}

.detailed-item:last-child .detailed-line {
  display: none;
}

.detailed-content-card {
  flex: 1;
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.detailed-content-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.detailed-item:last-child .detailed-content-card {
  margin-bottom: 0;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detailed-badge {
  font-family: var(--font-display);
  font-size: 9px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detailed-time {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--text-medium);
  font-weight: 600;
}

.detailed-desc {
  font-family: var(--font-body);
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
}

.detailed-date {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
  margin-top: 4px;
  border-top: 1px dashed #e8ecf1;
  padding-top: 8px;
}

/* Skeleton Loading State */
.skeleton-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.skeleton-item {
  display: flex;
  gap: 20px;
}

.skeleton-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-lines {
  flex: 1;
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: var(--radius-md);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  height: 14px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-title { width: 30%; height: 16px; }
.skeleton-text { width: 80%; }

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.empty-emoji {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-family: var(--font-display);
  font-size: 18px;
  color: #041b3c;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-muted);
  max-width: 360px;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.btn-reset {
  padding: 10px 20px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 10px var(--primary-glow);
  transition: all var(--transition-fast);
}

.btn-reset:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .filters-card {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .stats-bar {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
