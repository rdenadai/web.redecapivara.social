<template>
  <!-- Add a small bar with icons for comments, repost, likes (it shows the icon and numbers ) -->
  <div class="flex items-center space-x-4 mt-3 text-capivara-stone/60">
    <a class="flex items-center space-x-1 cursor-pointer hover:text-capivara-brown">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          fill="currentColor"
          d="M20.002 7a2 2 0 0 0-2-2h-12a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2a1 1 0 0 1 1 1v1.918l3.375-2.7a1 1 0 0 1 .625-.218h5a2 2 0 0 0 2-2V7Zm2 8a4 4 0 0 1-4 4h-4.648l-4.727 3.781A1.001 1.001 0 0 1 7.002 22v-3h-1a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v8Z"
        />
      </svg>
      <span>{{ post.replyCount || 0 }}</span>
    </a>
    <div class="relative flex items-center space-x-1 ml-2">
      <a
        ref="repostButtonRef"
        class="flex items-center space-x-1 cursor-pointer hover:text-capivara-brown"
        @click="toggleRepostMenu"
        :class="[post.viewer?.repost ? 'text-capivara-brown' : '']"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            fill="currentColor"
            d="M17.957 2.293a1 1 0 1 0-1.414 1.414L17.836 5H6a3 3 0 0 0-3 3v3a1 1 0 1 0 2 0V8a1 1 0 0 1 1-1h11.836l-1.293 1.293a1 1 0 0 0 1.414 1.414l2.47-2.47a1.75 1.75 0 0 0 0-2.474l-2.47-2.47ZM20 12a1 1 0 0 1 1 1v3a3 3 0 0 1-3 3H6.164l1.293 1.293a1 1 0 1 1-1.414 1.414l-2.47-2.47a1.75 1.75 0 0 1 0-2.474l2.47-2.47a1 1 0 0 1 1.414 1.414L6.164 17H18a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1Z"
          />
        </svg>
        <span>{{ post.repostCount || 0 }}</span>
      </a>
      <!-- Menu dropdown -->
      <div
        v-show="showRepostMenu"
        ref="repostMenuRef"
        class="absolute top-full left-0 mt-1 bg-white border border-capivara-stone/20 rounded-md shadow-lg z-20 min-w-[200px]"
      >
        <div
          v-if="!post.viewer?.repost"
          class="px-4 py-2 hover:bg-capivara-stone/10 cursor-pointer text-capivara-stone"
          @click="repostPostAction"
        >
          <div class="flex items-center gap-2"><RepostIcon class="!w-5 !h-5" /> Respostar</div>
        </div>
        <div
          v-else
          class="px-4 py-2 hover:bg-capivara-stone/10 cursor-pointer text-capivara-stone"
          @click="removeRepost"
        >
          <div class="flex items-center gap-2"><RepostIcon class="!w-5 !h-5" /> Remover Repost</div>
        </div>
        <div class="px-4 py-2 hover:bg-capivara-stone/10 cursor-pointer text-capivara-stone" @click="quotePost">
          <div class="flex items-center gap-2"><MentionIcon class="!w-5 !h-5" /> Citar</div>
        </div>
      </div>
    </div>
    <a
      class="flex items-center space-x-1 cursor-pointer hover:text-capivara-brown"
      :class="[post.viewer?.like ? 'text-capivara-brown' : '']"
      @click="socialLikeUnlike"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        :fill="post.viewer?.like ? 'rgb(122 92 62)' : 'none'"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="3"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{{ post.likeCount || 0 }}</span>
    </a>
  </div>
</template>
<script setup>
import { ref, toRefs, onMounted, onUnmounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import { likePost, unlikePost, repostPost, unrepostPost } from '@/services/atproto'
import RepostIcon from './icons/RepostIcon.vue'
import MentionIcon from './icons/MentionIcon.vue'

const toast = useToast()
const authStore = useAuthStore()

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

const { post } = toRefs(props)

const showRepostMenu = ref(false)
const repostMenuRef = ref(null)
const repostButtonRef = ref(null)

const toggleRepostMenu = () => {
  showRepostMenu.value = !showRepostMenu.value
}

// Detecta clique fora do menu de repost para fechá-lo
const handleClickOutside = (event) => {
  if (
    showRepostMenu.value &&
    repostMenuRef.value &&
    !repostMenuRef.value.contains(event.target) &&
    repostButtonRef.value &&
    !repostButtonRef.value.contains(event.target)
  ) {
    showRepostMenu.value = false
  }
}

const socialLikeUnlike = async () => {
  try {
    if (post.value.viewer?.like) {
      await unlikePost(authStore.server, authStore.accessToken, authStore.did, post.value.viewer.like)
      post.value.likeCount = Math.max((post.value.likeCount || 1) - 1, 0)
      post.value.viewer.like = null
    } else {
      const result = await likePost(
        authStore.server,
        authStore.accessToken,
        authStore.did,
        post.value.uri,
        post.value.cid
      )
      post.value.likeCount = (post.value.likeCount || 0) + 1
      // Store the like record URI so we can unlike later
      post.value.viewer.like = result.uri
    }
  } catch (error) {
    toast.error('Erro ao curtir/descurtir:', error)
  }
}

const repostPostAction = async () => {
  try {
    const result = await repostPost(
      authStore.server,
      authStore.accessToken,
      authStore.did,
      post.value.uri,
      post.value.cid
    )
    post.value.repostCount = (post.value.repostCount || 0) + 1
    post.value.viewer.repost = result.uri
    showRepostMenu.value = false
  } catch (error) {
    toast.error(`Erro ao repostar: ${error && error.message ? error.message : error}`)
  }
}

const removeRepost = async () => {
  try {
    await unrepostPost(authStore.server, authStore.accessToken, authStore.did, post.value.viewer.repost)
    post.value.repostCount = Math.max((post.value.repostCount || 1) - 1, 0)
    post.value.viewer.repost = null
    showRepostMenu.value = false
  } catch (error) {
    toast.error(`Erro ao remover repost: ${error.message}`)
  }
}

const quotePost = () => {
  showRepostMenu.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
