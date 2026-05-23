<script setup lang="ts">
import { onMounted } from "vue";
import { useKlienStore } from "~/stores/klien";
import { useToast } from "~/composables/useToast";
import ToastContainer from "~/components/listing/ToastContainer.vue";
import KlienTable from "~/components/klien/KlienTable.vue";
import KlienDrawerDetail from "~/components/klien/KlienDrawerDetail.vue";

definePageMeta({ layout: "dashboard" });

const store = useKlienStore();
const { toasts } = useToast();

onMounted(async () => {
  await store.fetchKliens();
});
</script>

<template>
  <div class="klien-page">
    <!-- Toast Notification System -->
    <ToastContainer :toasts="toasts" />

    <div class="listing-layout">
      <!-- Main Content Block -->
      <KlienTable />

      <!-- Sliding Details/Edit Drawer (Jira Style) -->
      <div
        class="detail-drawer-overlay"
        v-if="store.isDrawerOpen"
        @click="store.closeDrawer"
      ></div>

      <div class="detail-drawer" :class="{ 'is-open': store.isDrawerOpen }">
        <div v-if="store.selectedKlien" class="drawer-inner">
          <KlienDrawerDetail />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import "~/assets/css/listing.css";

.klien-page {
  width: 100%;
}
</style>
