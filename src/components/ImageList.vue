<template>
  <div v-if="images?.length" class="max-w-xl mt-2 gap-1 flex flex-wrap">
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
import { defineProps, toRefs } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
})

const { images } = toRefs(props)
</script>
