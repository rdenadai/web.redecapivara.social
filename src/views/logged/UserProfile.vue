<template>
  <div class="relative min-h-screen bg-capivara-off-white">
    <MenuView />
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto md:px-4 md:py-4">
      <div v-if="did" class="relative bg-white mb-8 bg-gradient-to-r text-white md:shadow-black/20 md:shadow-lg">
        <ProfileView :did="did" />
        <!-- Separator -->
        <div class="mt-5 pt-6 border-t border-capivara-stone/10"></div>
        <div class="flex items-center gap-4 text-capivara-brown/80 px-4">
          <FeedView :did="did" />
        </div>
      </div>
      <div v-else class="card p-6 bg-white">
        <h2 class="text-lg font-semibold text-black/80 mb-4">Perfil não encontrado</h2>
        <p class="text-capiv ara-stone/80">
          O perfil que você está tentando acessar não existe ou o identificador fornecido é inválido.
        </p>
      </div>
    </main>
    <CreatePostModal />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ProfileView from './ProfileView.vue'
import MenuView from '../MenuView.vue'
import FeedView from './FeedView.vue'
import CreatePostModal from './modal/CreatePostModal.vue'

const route = useRoute()

const handle = computed(() => route.params.handle || null)

const did = computed(() => {
  if (handle.value && handle.value.includes('@')) {
    return handle.value.replace('@', '')
  }
  return handle.value
})
</script>
