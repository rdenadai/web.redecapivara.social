<template>
  <div class="max-w-xl">
    <!-- image preview -->
    <div
      v-if="external && external.uri && /\.(gif|jpe?g|png)/i.test(external.uri)"
      class="max-w-xl mt-2"
    >
      <img
        :src="external.uri"
        :alt="external.title || external.description || 'preview'"
        class="rounded shadow object-cover"
      />
    </div>

    <!-- card format with embedded object (iframe fallback) -->
    <div v-else-if="external" class="mt-2">
      <div class="bg-white border rounded shadow p-4 w-full">
        <div class="flex items-start gap-4">
          <!-- title, short description and source link -->
          <div class="flex-1 min-w-0">
            <a
              v-if="external?.uri"
              :href="external.uri"
              target="_blank"
              rel="noopener noreferrer"
              class="block text-lg font-semibold text-capivara-brown hover:underline whitespace-normal break-all"
              :title="external.title || external.uri"
            >
              {{ external.title || external.name || external.uri }}
            </a>

            <div
              v-else
              class="block text-lg font-semibold text-gray-800 whitespace-normal break-all"
            >
              {{ external.title || external.name || "External content" }}
            </div>

            <p
              v-if="external?.description"
              class="mt-1 text-sm text-gray-600 line-clamp-3"
            >
              {{ external.description }}
            </p>

            <div class="mt-2 text-xs text-gray-500">
              <a
                v-if="external?.uri"
                :href="external.uri"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:underline break-all"
              >
                {{ external.uri }}
              </a>
            </div>
          </div>
        </div>

        <!-- embedded preview (object) with iframe fallback -->
        <div v-if="external?.uri" class="mt-4 w-full">
          <object :data="external.uri" class="rounded border overflow-hidden">
            <!-- iframe fallback -->
            <iframe
              :src="external.uri"
              sandbox="allow-scripts allow-same-origin"
              title="External preview"
            ></iframe>
          </object>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  external: {
    type: Object,
    required: false,
    default: null,
  },
});
</script>
