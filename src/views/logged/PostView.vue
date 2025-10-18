<template>
  <div v-if="post?.blocked" class="flex items-center space-x-2 text-sm text-capivara-stone/60">
    <InfoIcon class="w-4 h-4" />
    <span>Bloqueado</span>
  </div>
  <div v-else class="flex items-start space-x-4">
    <div @click="handleClickGoToPost($event, post.uri)" class="flex space-x-4 w-full cursor-pointer">
      <img
        v-if="post.author?.avatar"
        :src="post.author.avatar"
        alt="Avatar"
        class="w-12 h-12 rounded-full object-cover"
      />
      <div class="flex flex-1 flex-col">
        <div class="flex flex-col items-start md:space-x-2 mb-2">
          <router-link
            :to="`/${handleLink(post.author?.handle, post.author?.did)}/profile`"
            class="font-bold text-black/80 hover:underline"
            >{{ post.author?.displayName || post.author?.handle }}</router-link
          >
          <div class="flex flex-col md:flex-row">
            <span class="text-sm text-capivara-stone/60 font-mono">@{{ post.author?.handle }}</span>
            <span class="text-sm text-capivara-stone/60 font-mono"
              ><span class="hidden md:inline-block">&nbsp;•&nbsp;</span
              >{{ numberOfDaysHoursOrMinutesAgo(post.indexedAt) }}</span
            >
          </div>
        </div>
        <ParsedPost
          :content="post?.record?.text || post?.value?.text || ''"
          :embed="post?.record?.embed || post?.value?.embed"
        />
        <ImageList
          v-if="post?.embed?.images?.length || post?.embed?.media?.images?.length || post?.embeds?.length"
          :images="(post?.embed?.images || post?.embed?.media?.images || post?.embeds[0]?.images) ?? []"
        />
        <ExternalElement
          v-if="
            post?.record?.embed?.external || post?.record?.embed?.media?.external || post?.value?.embed?.media?.external
          "
          :external="
            post?.record?.embed?.external || post?.record?.embed?.media?.external || post?.value?.embed?.media?.external
          "
        />
        <div class="border-l-4 border-capivara-stone/20 pl-4 mt-4" v-if="post?.embed?.record">
          <PostView :post="post.embed.record?.record || post.embed.record" :show-social-actions="false" />
        </div>
        <SocialPostActions v-if="showSocialActions" :post="post" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, toRefs } from 'vue'
import ImageList from '@/components/ImageList.vue'
import ExternalElement from '@/components/ExternalElement.vue'
import ParsedPost from '@/components/ParsedPost.vue'
import SocialPostActions from '@/components/SocialPostActions.vue'
import InfoIcon from '@/components/icons/InfoIcon.vue'
import { numberOfDaysHoursOrMinutesAgo } from '@/utils'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  showSocialActions: {
    type: Boolean,
    default: true,
  },
})

const { post, showSocialActions } = toRefs(props)

const handleLink = (handle, did) => {
  return handle && handle !== 'handle.invalid' ? handle : did
}

const handleClickGoToPost = (event, postUri) => {
  // Check if the click target is a link or is inside a link
  if (event.target.closest('a')) {
    return
  }

  const postId = postUri.split('/').pop()
  window.location.href = `/${handleLink(post.value.author?.handle, post.value.author?.did)}/post/${postId}`
}
</script>
