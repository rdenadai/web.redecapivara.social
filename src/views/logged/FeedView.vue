<template>
  <!-- Author feed -->
  <div class="w-full">
    <div v-if="feed.length === 0 && !loadingMore" class="text-center py-4">Nenhum post encontrado.</div>
    <div v-for="(post, index) in feed" :key="post.post.uri">
      <div v-if="post?.reply === undefined || post?.reason?.$type.includes('#reasonRepost')" class="mb-6">
        <div
          v-if="post?.reason?.$type.includes('#reasonRepost')"
          class="inline-flex rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 inset-ring inset-ring-gray-400 mb-4"
        >
          <RepostIcon class="inline w-[1.25em] h-[1.25em] text-capivara-stone/60 mr-1" />
          <span
            >repostado por
            <router-link
              :to="`/${handleLink(post?.reason?.by?.handle, post?.reason?.by?.did)}/profile`"
              class="font-bold text-black/80 hover:underline ml-1"
            >
              {{ post?.reason?.by?.displayName || `@${post?.reason?.by?.handle}` }}
            </router-link></span
          >
        </div>
        <PostView :post="post.post" :showSocialActions="true" />
        <div class="flex border-t border-capivara-stone/10 w-full mt-4"></div>
      </div>
    </div>
    <div v-if="loadingMore" class="text-center py-4">Carregando...</div>
    <div v-if="noMore && feed.length > 0" class="text-center py-4 text-capivara-stone/60">Fim da lista</div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted, onUnmounted, toRefs, watchEffect } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getAuthorFeed } from '@/services/atproto'
import PostView from './PostView.vue'
import RepostIcon from '@/components/icons/RepostIcon.vue'

const authStore = useAuthStore()

const feed = ref([])
const cursor = ref(null)
const loadingMore = ref(false)
const noMore = ref(false)

const props = defineProps({
  did: {
    type: String,
    default: null,
  },
})

const { did } = toRefs(props)

const handleLink = (handle, did) => {
  return handle && handle !== 'handle.invalid' ? handle : did
}

const fetchInitialFeed = async () => {
  // Fetch initial feed based on props.did
  if (did?.value) {
    const authorFeed = await getAuthorFeed(authStore.server, authStore.accessToken, did.value)
    // Populate feed, cursor, noMore based on authorFeed response
    if (authorFeed.feed && authorFeed.feed.length > 0) {
      feed.value = authorFeed.feed
      cursor.value = authorFeed.cursor || null
      noMore.value = !cursor.value
    } else {
      feed.value = []
      cursor.value = null
      noMore.value = true
    }
  } else {
    feed.value = []
    cursor.value = null
    noMore.value = true
  }
}

const loadMoreFeed = async () => {
  if (loadingMore.value || noMore.value) return
  if (!cursor.value) {
    noMore.value = true
    return
  }

  loadingMore.value = true
  try {
    const authorFeed = await getAuthorFeed(authStore.server, authStore.accessToken, did.value, 25, cursor.value)
    if (authorFeed.feed && authorFeed.feed.length > 0) {
      feed.value.push(...authorFeed.feed)
      cursor.value = authorFeed.cursor || null
      noMore.value = !cursor.value
    } else {
      noMore.value = true
    }
  } catch (err) {
    console.error('Error loading more feed:', err)
  } finally {
    loadingMore.value = false
  }
}

const onScroll = async () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    await loadMoreFeed()
  }
}

onMounted(async () => {
  window.addEventListener('scroll', onScroll)
})

watchEffect(async () => {
  if (did?.value) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    await fetchInitialFeed()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
