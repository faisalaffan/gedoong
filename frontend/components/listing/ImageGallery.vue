<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  imageUrls?: string[];
  imageUrl?: string;
}>();

const emit = defineEmits<{
  (e: "openFullScreen", url: string): void;
}>();

const activeIndex = ref(0);

function setGalleryIndex(index: number) {
  activeIndex.value = index;
}

function handleMainImageClick() {
  const url =
    props.imageUrls && props.imageUrls.length > 0
      ? props.imageUrls[activeIndex.value]
      : props.imageUrl;
  if (url) {
    emit("openFullScreen", url);
  }
}
</script>

<template>
  <!-- Multiple images Gallery Carousel -->
  <div
    class="drawer-media-gallery"
    v-if="imageUrls && imageUrls.length > 0"
  >
    <div
      class="gallery-main-container"
      @click="handleMainImageClick"
    >
      <img
        :src="imageUrls[activeIndex]"
        class="gallery-main-img"
      />
      <div class="gallery-hover-overlay">
        <svg
          class="eye-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
          ></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </div>
      <div class="gallery-counter">
        {{ activeIndex + 1 }} / {{ imageUrls.length }}
      </div>
    </div>
    <div class="gallery-thumbnails">
      <div
        v-for="(url, i) in imageUrls"
        :key="i"
        class="gallery-thumb-item"
        :class="{ active: i === activeIndex }"
        @click="setGalleryIndex(i)"
      >
        <img :src="url" class="thumb-img" />
      </div>
    </div>
  </div>
  <div
    class="drawer-media-gallery"
    v-else-if="imageUrl"
  >
    <div
      class="gallery-main-container"
      @click="handleMainImageClick"
    >
      <img
        :src="imageUrl"
        class="gallery-main-img"
      />
      <div class="gallery-hover-overlay">
        <svg
          class="eye-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
          ></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </div>
    </div>
  </div>
</template>
