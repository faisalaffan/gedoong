<script setup lang="ts">
import { useListingStore } from "~/stores/listing";
import { useDealStore } from "~/stores/deal";
import { useKomisiStore } from "~/stores/komisi";

definePageMeta({ layout: "dashboard" });

const listingStore = useListingStore();
const dealStore = useDealStore();
const komisiStore = useKomisiStore();

const totalListings = ref(0);
const dealCount = ref(0);
const followUpCount = ref(0);
const totalCommission = ref("Rp 0jt");

const pipelineStages = ref([
  { label: "Prospek", count: 0 },
  { label: "Follow-up", count: 0 },
  { label: "Nego", count: 0 },
  { label: "Closing", count: 0 },
  { label: "Deal", count: 0 },
]);

const activities = ref<any[]>([]);

function getActivityType(desc: string) {
  const text = desc.toLowerCase()
  if (text.includes('menambahkan') || text.includes('membuat') || text.includes('mencatat')) {
    return {
      label: 'Tambah',
      color: '#16a34a',
      bg: '#f0fdf4',
      icon: '✨'
    }
  }
  if (text.includes('menghapus')) {
    return {
      label: 'Hapus',
      color: '#dc2626',
      bg: '#fef2f2',
      icon: '🗑️'
    }
  }
  if (text.includes('memindahkan') || text.includes('pindah')) {
    return {
      label: 'Pipeline',
      color: '#ea580c',
      bg: '#fff7ed',
      icon: '📋'
    }
  }
  return {
    label: 'Update',
    color: '#0052cc',
    bg: '#eff6ff',
    icon: '📝'
  }
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

onMounted(async () => {
  const supabase = useSupabaseClient();

  // 1. Fetch all store data concurrently using Gedoong's reactive Pinia stores
  await Promise.all([
    listingStore.fetchListings(),
    dealStore.fetchDeals(),
    komisiStore.fetchKomisiList(),
  ]);

  // 2. Map statistics from Pinia stores
  totalListings.value = listingStore.listings.length;

  const allDeals = dealStore.deals;
  dealCount.value = allDeals.filter((d: any) => d.stage === "Deal").length;
  followUpCount.value = allDeals.filter(
    (d: any) => d.stage === "Follow-up",
  ).length;

  // 3. Map pipeline summary stage counts
  pipelineStages.value.forEach((stage) => {
    stage.count = allDeals.filter((d: any) => d.stage === stage.label).length;
  });

  // 4. Calculate total paid commission from komisiStore
  const totalPaid = komisiStore.totalDibayar;
  if (totalPaid >= 1000000) {
    totalCommission.value = `Rp ${(totalPaid / 1000000).toFixed(0)}jt`;
  } else {
    totalCommission.value = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(totalPaid);
  }

  // 5. Fetch dynamic recent activities (Limit to 5 for clean dashboard)
  const { data: recentActivities, error: actError } = await supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (actError) {
    console.error("Error fetching activities:", actError.message);
  }

  activities.value = recentActivities || [];
});
</script>

<template>
  <div class="dashboard-page">
    <h2 class="page-title">Dashboard</h2>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value" style="color: #0052cc">{{ totalListings }}</div>
        <div class="stat-label">Total Listing</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #16a34a">{{ dealCount }}</div>
        <div class="stat-label">Deal Bulan Ini</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #e07b00">{{ followUpCount }}</div>
        <div class="stat-label">Follow-up Aktif</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #0052cc">
          {{ totalCommission }}
        </div>
        <div class="stat-label">Komisi Bulan Ini</div>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- Beautified Recent Activities -->
      <div class="card card-aktivitas">
        <div class="card-header-flex">
          <h3 class="card-title">Aktivitas Terbaru</h3>
          <NuxtLink to="/aktivitas" class="btn-view-all">
            Lihat Semua →
          </NuxtLink>
        </div>
        
        <div v-if="activities.length === 0" class="empty-activities">
          <span class="empty-icon">📭</span>
          <p>Belum ada aktivitas tercatat di sistem.</p>
        </div>
        
        <ul v-else class="activities-timeline">
          <li v-for="item in activities" :key="item.id" class="timeline-item">
            <div class="timeline-dot-wrapper">
              <div 
                class="timeline-dot" 
                :style="{ backgroundColor: getActivityType(item.description).color }"
              >
                {{ getActivityType(item.description).icon }}
              </div>
              <div class="timeline-line"></div>
            </div>
            
            <div class="timeline-content">
              <div class="timeline-body">
                <span 
                  class="activity-badge" 
                  :style="{ 
                    color: getActivityType(item.description).color,
                    backgroundColor: getActivityType(item.description).bg
                  }"
                >
                  {{ getActivityType(item.description).label }}
                </span>
                <p class="activity-desc">{{ item.description }}</p>
              </div>
              <span class="activity-time">
                {{ formatDate(item.created_at) }}, {{ formatTime(item.created_at) }}
              </span>
            </div>
          </li>
        </ul>
      </div>

      <div class="card card-pipeline">
        <h3 class="card-title">Pipeline Summary</h3>
        <div class="pipeline-summary">
          <div
            v-for="stage in pipelineStages"
            :key="stage.label"
            class="pipeline-stage"
          >
            <span class="stage-label">{{ stage.label }}</span>
            <span class="stage-count">{{ stage.count }}</span>
          </div>
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
  box-shadow: var(--shadow-sm);
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
  margin: 0;
}

/* Beautified Activities Timeline styling */
.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-view-all {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.btn-view-all:hover {
  color: var(--primary-hover);
}

.empty-activities {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.activities-timeline {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  gap: 16px;
  position: relative;
}

.timeline-dot-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.timeline-dot {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: white;
  z-index: 2;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.timeline-line {
  width: 2px;
  flex-grow: 1;
  background: #e8ecf1;
  margin-top: 4px;
}

.timeline-item:last-child .timeline-line {
  display: none;
}

.timeline-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 20px;
  gap: 16px;
}

.timeline-item:last-child .timeline-content {
  padding-bottom: 0;
}

.timeline-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}

.activity-badge {
  font-family: var(--font-display);
  font-size: 9px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.activity-desc {
  font-family: var(--font-body);
  font-size: 13px;
  color: #334155;
  font-weight: 500;
  line-height: 1.45;
}

.activity-time {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
  white-space: nowrap;
  margin-top: 2px;
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
  color: #0052cc;
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
