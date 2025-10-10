<template>
  <div class="min-h-screen bg-capivara-off-white">
    <MenuView />
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto md:px-4 md:py-4">
      <div v-if="loading" class="text-center text-gray-500">Carregando...</div>
      <div v-if="error" class="text-center text-red-500">{{ error }}</div>
      <div v-if="!loading && !error && !post" class="text-center text-gray-500">Nenhum post encontrado.</div>
      <div v-if="!loading && !error && post">
        <div class="card mb-8 bg-gradient-to-r text-white">
          <div class="flex flex-col">
            <div class="flex items-start space-x-4">
              <img
                v-if="profileData?.avatar"
                :src="profileData.avatar"
                alt="Avatar"
                class="w-12 h-12 rounded-full object-cover"
              />
              <div class="flex flex-1 flex-col">
                <div class="flex flex-col md:flex-row items-start md:items-center md:space-x-2">
                  <router-link
                    :to="`/${profileData?.handle}/profile`"
                    class="font-bold text-black/80 hover:underline"
                    >{{ profileData?.displayName || profileData?.handle }}</router-link
                  >
                  <span class="text-sm text-capivara-stone/60 font-mono">@{{ profileData?.handle }}</span>
                  <span class="text-sm text-capivara-stone/60 font-mono"
                    ><span class="hidden md:inline-block">•&nbsp;</span
                    >{{ new Date(post.value.createdAt).toLocaleDateString() }}</span
                  >
                </div>
                <ParsedPost :content="post.value?.text" :embed="post.value.embed" />
                <ImageList v-if="post.value?.embed?.images" :images="post.value.embed.images" />
                <ExternalElement v-if="post?.value?.embed?.external" :external="post.value.embed.external" />
                <SocialPostActions :post="post" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProfile } from '@/composables/useProfile'
import { getPost } from '@/services/atproto'
import MenuView from '../MenuView.vue'

const route = useRoute()
const authStore = useAuthStore()

const handle = computed(() => route.params.handle || null)
const postId = computed(() => route.params.postId || null)

const { profileData } = useProfile(handle)

const post = ref(null)
const loading = ref(false)
const error = ref(null)

watchEffect(async () => {
  if (handle.value && postId.value) {
    loading.value = true
    error.value = null
    try {
      const response = await getPost(authStore.server, authStore.accessToken, handle.value, postId.value)
      console.log('Fetched post:', response)
      post.value = response || null
    } catch (err) {
      console.error('Error fetching post:', err)
      error.value = 'Failed to load post.'
    } finally {
      loading.value = false
    }
  }
})
</script>
