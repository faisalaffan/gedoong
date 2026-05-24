<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useListingStore } from "~/stores/listing";
import { useToast } from "~/composables/useToast";
import ToastContainer from "~/components/listing/ToastContainer.vue";
import ListingTable from "~/components/listing/ListingTable.vue";
import ListingDrawerDetail from "~/components/listing/ListingDrawerDetail.vue";
import ListingFormWizard from "~/components/listing/ListingFormWizard.vue";
import FullScreenModal from "~/components/listing/FullScreenModal.vue";

definePageMeta({ layout: "dashboard" });

const route = useRoute();
const store = useListingStore();
const { toasts } = useToast();

const isChildRoute = computed(() => !!route.params.id);

onMounted(async () => {
  await store.fetchListings();
});
</script>

<template>
  <div class="listing-page">
    <template v-if="isChildRoute">
      <NuxtPage />
    </template>
    <template v-else>
      <!-- Toast Notification System -->
      <ToastContainer :toasts="toasts" />

      <div class="listing-layout">
        <!-- Main Content Block -->
        <ListingTable />

        <!-- Sliding Details/Edit Drawer (Jira Style) -->
        <div
          class="detail-drawer-overlay"
          v-if="store.isDrawerOpen"
          @click="store.closeDrawer"
        ></div>

        <div class="detail-drawer" :class="{ 'is-open': store.isDrawerOpen }">
          <div v-if="store.selectedListing" class="drawer-inner">
            <ListingFormWizard v-if="store.isDrawerEditing" />
            <ListingDrawerDetail
              v-else
              @edit="store.startEditing(store.selectedListing)"
            />
          </div>
        </div>
      </div>

      <!-- Full Screen Image Modal Viewer -->
      <FullScreenModal
        :is-open="store.isFullScreenOpen"
        :image-url="store.fullScreenImageUrl"
        :caption="store.selectedListing?.properti"
        @close="store.closeFullScreen"
      />
    </template>
  </div>
</template>

<style>
@import "~/assets/css/listing.css";
</style>
