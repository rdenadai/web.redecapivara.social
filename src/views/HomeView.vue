<template>
  <div class="relative min-h-screen bg-capivara-off-white">
    <MenuView />
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto md:px-4 md:py-4">
      <!-- Welcome Section -->
      <div class="relative bg-white mb-8 bg-gradient-to-r text-white md:shadow-black/20 md:shadow-lg">
        <ProfileView />
        <!-- Separator -->
        <div class="mt-5 pt-6 border-t border-capivara-stone/10"></div>
        <div class="flex items-center gap-4 text-capivara-brown/80 px-4">
          <TimelineView />
        </div>
      </div>
    </main>
    <CreatePostModal />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import ProfileView from './logged/ProfileView.vue'
import TimelineView from './logged/TimelineView.vue'
import MenuView from './MenuView.vue'
import CreatePostModal from './logged/modal/CreatePostModal.vue'

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>
