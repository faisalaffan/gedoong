<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue";

const props = defineProps<{
  isOpen: boolean;
  imageUrl: string;
  caption?: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

function handleEscKey(e: KeyboardEvent) {
  if (e.key === "Escape") {
    emit("close");
  }
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      window.addEventListener("keydown", handleEscKey);
    } else {
      window.removeEventListener("keydown", handleEscKey);
    }
  }
);

onMounted(() => {
  if (props.isOpen) {
    window.addEventListener("keydown", handleEscKey);
  }
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleEscKey);
});
</script>

<template>
  <div
    class="fullscreen-image-modal"
    :class="{ 'is-active': isOpen }"
    @click="emit('close')"
  >
    <div class="fullscreen-image-content" @click.stop>
      <button
        class="fullscreen-close-btn"
        @click="emit('close')"
        aria-label="Close Preview"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <img
        v-if="imageUrl"
        :src="imageUrl"
        class="fullscreen-img"
        alt="Preview Properti"
      />
      <div class="fullscreen-caption" v-if="caption">
        {{ caption }}
      </div>
    </div>
  </div>
</template>
