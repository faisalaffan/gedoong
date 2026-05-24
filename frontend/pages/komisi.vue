<script setup lang="ts">
import { onMounted } from "vue";
import { useKomisiStore } from "~/stores/komisi";
import { useKlienStore } from "~/stores/klien";
import { useDealStore } from "~/stores/deal";
import { useToast } from "~/composables/useToast";
import ToastContainer from "~/components/listing/ToastContainer.vue";
import KomisiStats from "~/components/komisi/KomisiStats.vue";
import KomisiTable from "~/components/komisi/KomisiTable.vue";
import KomisiDrawerDetail from "~/components/komisi/KomisiDrawerDetail.vue";

definePageMeta({ layout: "dashboard" });

const store = useKomisiStore();
const { toasts } = useToast();

onMounted(async () => {
  const klienStore = useKlienStore();
  const dealStore = useDealStore();
  
  await Promise.all([
    store.fetchKomisiList(),
    klienStore.fetchKliens(),
    dealStore.fetchDeals(),
  ]);
});
</script>

<template>
  <div class="komisi-page">
    <!-- Toast Notification System -->
    <ToastContainer :toasts="toasts" />

    <div class="listing-layout">
      <!-- Main Content Block -->
      <div class="listing-main-content">
        <!-- Commission Aggregated Summary Cards -->
        <KomisiStats />

        <!-- Interactive List Table -->
        <KomisiTable />
      </div>

      <!-- Sliding Details/Edit Drawer (Jira Style) -->
      <div
        class="detail-drawer-overlay"
        v-if="store.isDrawerOpen"
        @click="store.closeDrawer"
      ></div>

      <div class="detail-drawer" :class="{ 'is-open': store.isDrawerOpen }">
        <div v-if="store.selectedKomisi" class="drawer-inner">
          <KomisiDrawerDetail />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import "~/assets/css/listing.css";

.komisi-page {
  width: 100%;
}
</style>
