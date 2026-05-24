<script setup lang="ts">
import { computed } from "vue";
import type { TabName } from "~/types/listing";
import { TABS_SEQUENCE } from "~/types/listing";

const props = defineProps<{
  activeTab: TabName;
  isUploading: boolean;
}>();

const emit = defineEmits<{
  (e: "goToTab", tab: TabName): void;
}>();

const activeTabIndex = computed(() => TABS_SEQUENCE.indexOf(props.activeTab));

const steps = [
  { name: "umum", label: "Umum", num: 1 },
  { name: "lokasi", label: "Lokasi", num: 2 },
  { name: "fisik", label: "Fisik", num: 3 },
  { name: "fasilitas", label: "Fasilitas", num: 4 },
  { name: "media", label: "Media", num: 5 },
] as const;

function getStepStatus(tabName: TabName) {
  const index = TABS_SEQUENCE.indexOf(tabName);
  if (index < activeTabIndex.value) return "completed";
  if (index === activeTabIndex.value) return "active";
  return "upcoming";
}

function getStepClass(tabName: TabName) {
  const status = getStepStatus(tabName);
  return {
    "step-completed": status === "completed",
    "step-active": status === "active",
    "step-upcoming": status === "upcoming",
  };
}

function handleStepClick(tabName: TabName) {
  if (props.isUploading) return;
  emit("goToTab", tabName);
}
</script>

<template>
  <div class="drawer-stepper-container">
    <!-- Stepper Progress Track Bar Behind Circles -->
    <div class="stepper-progress-track">
      <div
        class="stepper-progress-fill"
        :style="{ width: activeTabIndex * 25 + '%' }"
      ></div>
    </div>

    <div class="stepper-steps-wrapper">
      <button
        v-for="step in steps"
        :key="step.name"
        type="button"
        class="stepper-step"
        :class="getStepClass(step.name)"
        @click="handleStepClick(step.name)"
        :disabled="isUploading"
      >
        <div class="step-icon-circle">
          <span
            v-if="getStepStatus(step.name) === 'completed'"
            class="step-check-icon"
            >✓</span
          >
          <span v-else>{{ step.num }}</span>
        </div>
        <span class="step-label">{{ step.label }}</span>
      </button>
    </div>
  </div>
</template>
