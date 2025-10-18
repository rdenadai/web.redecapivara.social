<template>
  <CreatePostView
    :show="showCreatePostModal"
    class="w-full"
    @close="() => (showCreatePostModal = false)"
    @post-created="() => (showCreatePostModal = false)"
  />
  <div class="sticky bottom-1 z-50">
    <div class="max-w-7xl mx-auto md:px-4">
      <div class="flex relative h-16">
        <div class="text-white p-4 flex z-50">
          <button
            @click="showCreatePostModalCall"
            class="absolute right-8 bottom-8 text-white p-4 rounded-full shadow-lg transition-colors bg-capivara-brown hover:bg-capivara-dark-brown flex items-center justify-center cursor-pointer"
            title="Criar novo post"
          >
            <PostIcon />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CreatePostView from './CreatePostView.vue'
import PostIcon from '@/components/icons/PostIcon.vue'

const showCreatePostModal = ref(false)

const showCreatePostModalCall = () => {
  showCreatePostModal.value = true
}
</script>
