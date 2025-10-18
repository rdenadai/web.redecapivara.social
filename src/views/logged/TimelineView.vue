<!-- Timeline for the account should list and load as the user scroll posts from it's friends -->
<template>
  <div class="w-full min-h-screen">
    <!-- Main Content -->
    <main class="w-full bg-white">
      <p v-if="feed.length === 0 && !loadingMore" class="text-capivara-stone/80">
        Sua timeline está vazia. Siga pessoas para ver posts aqui.
      </p>
      <div v-for="{ post, reply, reason } in feed" :key="post.uri" class="flex flex-col items-start bg-white">
        <div v-if="reply === undefined || reason?.$type.includes('#reasonRepost')" class="mb-5 w-full">
          <div
            v-if="reason?.$type.includes('#reasonRepost')"
            class="inline-flex bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 mb-4"
          >
            <RepostIcon class="inline w-[1.25em] h-[1.25em] text-capivara-stone/60 mr-1" />
            <span
              >repostado por
              <router-link
                :to="`/${handleLink(reason?.by?.handle, reason?.by?.did)}/profile`"
                class="font-bold text-black/80 hover:underline ml-1"
              >
                {{ reason?.by?.displayName || `@${reason?.by?.handle}` }}
              </router-link></span
            >
          </div>
          <PostView :post="post" :showSocialActions="true" />
          <div class="flex border-t border-capivara-stone/20 w-full mt-4"></div>
        </div>
      </div>

      <div v-if="loadingMore" class="text-center py-4">Carregando...</div>
      <div v-if="noMore && feed.length > 0" class="text-center py-4 text-capivara-stone/60">Fim da lista</div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import { useProfile } from '@/composables/useProfile'
import { getTimeline } from '@/services/atproto'
import PostView from './PostView.vue'
import RepostIcon from '@/components/icons/RepostIcon.vue'

const router = useRouter()
const { error: showError } = useToast()
const authStore = useAuthStore()
const { profileData, stats } = useProfile()

const feed = ref([])
const cursor = ref(null)
const loadingMore = ref(false)
const noMore = ref(false)

const handleLink = (handle, did) => {
  return handle && handle !== 'handle.invalid' ? handle : did
}

const fetchInitialTimeline = async () => {
  if (!profileData.value) {
    router.push('/')
    return
  }

  loadingMore.value = true
  try {
    const response = await getTimeline(authStore.server, authStore.accessToken, authStore.did, 25)
    feed.value = response.feed || []
    cursor.value = response.cursor || null
    noMore.value = !cursor.value
  } catch (err) {
    showError('Erro ao carregar timeline.')
    console.error(err)
  } finally {
    loadingMore.value = false
  }
}

const loadMoreTimeline = async () => {
  if (loadingMore.value || noMore.value) return
  if (!cursor.value) {
    noMore.value = true
    return
  }

  loadingMore.value = true
  try {
    const moreTimeline = await getTimeline(authStore.server, authStore.accessToken, authStore.did, 25, cursor.value)

    if (moreTimeline.feed && moreTimeline.feed.length > 0) {
      feed.value.push(...moreTimeline.feed)
      cursor.value = moreTimeline.cursor || null
      if (!cursor.value) noMore.value = true
    } else {
      cursor.value = null
      noMore.value = true
    }
  } catch (err) {
    console.error('Error loading more Timeline:', err)
  } finally {
    loadingMore.value = false
  }
}

function onScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    loadMoreTimeline()
  }
}

onMounted(() => {
  fetchInitialTimeline()
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
