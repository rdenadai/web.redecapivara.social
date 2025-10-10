<template>
  <div class="w-full max-w-xl gap-2">
    <!-- image preview -->
    <div
      v-if="external && external.uri && /\.(gif|jpe?g|png)/i.test(external.uri)"
      class="mt-2"
    >
      <img
        :src="external.uri"
        :alt="external.title || external.description || 'preview'"
        class="rounded shadow object-cover w-full max-h-96"
      />
    </div>

    <!-- card format with embedded object (iframe fallback) -->
    <div v-else-if="external" class="mt-2">
      <div
        class="bg-white border rounded shadow p-4 max-w-full overflow-hidden"
      >
        <div class="flex items-start gap-4">
          <!-- title, short description and source link -->
          <div class="flex-1 min-w-0">
            <a
              v-if="external?.uri"
              :href="external.uri"
              target="_blank"
              rel="noopener noreferrer"
              class="block text-lg font-semibold text-capivara-brown hover:underline break-words"
              :title="external.title || external.uri"
            >
              {{ external.title || external.name || external.uri }}
            </a>

            <div
              v-else
              class="block text-lg font-semibold text-gray-800 break-words"
            >
              {{ external.title || external.name || "External content" }}
            </div>

            <p
              v-if="external?.description"
              class="mt-1 text-sm text-gray-600 line-clamp-3 break-words"
            >
              {{ external.description }}
            </p>

            <div class="mt-2 text-xs text-gray-500 break-all">
              <a
                v-if="external?.uri"
                :href="external.uri"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:underline"
              >
                {{ external.uri }}
              </a>
            </div>
          </div>
        </div>

        <!-- embedded preview (object) with iframe fallback -->
        <div
          v-if="external?.uri"
          class="mt-4 w-full max-w-full overflow-hidden"
        >
          <div
            class="relative w-full max-w-full"
            style="padding-bottom: 48%; max-height: 12rem"
          >
            <iframe
              :src="external.uri"
              sandbox="allow-scripts allow-same-origin"
              title="External preview"
              class="absolute inset-0 w-full h-full border-0 rounded"
              style="max-width: 100%"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  external: {
    type: Object,
    required: false,
    default: null,
  },
});
</script>
