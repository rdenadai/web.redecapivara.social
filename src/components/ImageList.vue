<template>
  <!-- If we have embed images -->
  <div v-if="props.images?.length" class="max-w-xl mt-2 gap-2">
    <a
      v-for="(image, idx) in props.images"
      :key="image.fullsize || image.thumb"
      :href="image.fullsize || image.thumb"
      :style="{ width: `${100 / Math.min(props.images.length, 3)}%` }"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-block"
    >
      <img :src="image.thumb" :alt="image.alt" class="rounded object-cover" />
    </a>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
});
</script>
