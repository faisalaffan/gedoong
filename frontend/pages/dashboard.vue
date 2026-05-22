<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { db } from '~/utils/db'

definePageMeta({ layout: 'dashboard' })

const totalListings = ref(0)
const dealCount = ref(0)
const followUpCount = ref(0)
const totalCommission = ref('Rp 0jt')

const pipelineStages = ref([
  { label: 'Prospek', count: 0 },
  { label: 'Follow-up', count: 0 },
  { label: 'Nego', count: 0 },
  { label: 'Closing', count: 0 },
  { label: 'Deal', count: 0 },
])

const activities = ref<string[]>([])

onMounted(async () => {
  // 1. Total listings count from IndexedDB listings
  totalListings.value = await db.listings.count()

  // 2. Fetch all deals from IndexedDB
  const allDeals = await db.deals.toArray()
  
  // 3. Count stages
  dealCount.value = allDeals.filter(d => d.stage === 'Deal').length
  followUpCount.value = allDeals.filter(d => d.stage === 'Follow-up').length

  // 4. Calculate total paid commission
  const allCommissions = await db.komisi.toArray()
  const paidCommissions = allCommissions.filter(k => k.status === 'Dibayar')
  const totalPaid = paidCommissions.reduce((acc, curr) => {
    const val = parseInt(curr.komisi.replace(/\D/g, "")) || 0
    return acc + val
  }, 0)
  totalCommission.value = `Rp ${totalPaid}jt`

  // 5. Aggregate pipeline summary stage count
  pipelineStages.value.forEach(stage => {
    stage.count = allDeals.filter(d => d.stage === stage.label).length
  })

  // 6. Generate dynamic recent activities
  const allClients = await db.kliens.toArray()
  const list: string[] = []

  // Add deals activities
  allDeals.slice(-2).forEach(deal => {
    list.push(`Kesepakatan dengan ${deal.name} untuk properti "${deal.properti}" berada di tahap ${deal.stage}.`)
  })

  // Add commission activities
  allCommissions.slice(-2).forEach(k => {
    list.push(`Pencatatan keuangan: Komisi ${k.komisi} untuk "${k.properti}" saat ini berstatus ${k.status}.`)
  })

  // Add client list activities
  allClients.slice(-2).forEach(c => {
    list.push(`Data kontak klien "${c.nama}" (${c.kontak}) siap dikelola di direktori.`)
  })

  // Fallback if no records yet
  if (list.length === 0) {
    list.push('Belum ada aktivitas tercatat di sistem.')
  }

  activities.value = list.reverse()
})
</script>

<template>
  <div class="dashboard-page">
    <h2 class="page-title">Dashboard</h2>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value" style="color: #0052CC">{{ totalListings }}</div>
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
        <div class="stat-value" style="color: #0052CC">{{ totalCommission }}</div>
        <div class="stat-label">Komisi Bulan Ini</div>
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
