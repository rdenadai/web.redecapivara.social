<template>
  <div>
    <div v-if="reason === 'like' || reason === 'like-via-repost'" class="pr-2">
      <HeartIcon class="h-10 w-10 text-pink-500" />
    </div>
    <div
      v-else-if="reason === 'reply' || reason === 'reply-via-repost'"
      class="pr-2"
    >
      <ReplyIcon class="h-10 w-10 text-blue-500" />
    </div>
    <div
      v-else-if="reason === 'repost' || reason === 'repost-via-repost'"
      class="pr-2"
    >
      <RepostIcon class="h-10 w-10 text-green-500" />
    </div>
    <div
      v-else-if="reason === 'mention' || reason === 'mention-via-repost'"
      class="pr-2"
    >
      <MentionIcon class="h-10 w-10 text-purple-500" />
    </div>
    <div
      v-else-if="reason === 'follow' || reason === 'follow-via-repost'"
      class="pr-2"
    >
      <FollowIcon class="h-10 w-10 text-yellow-500" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import ReplyIcon from "../icons/ReplyIcon.vue";
import RepostIcon from "../icons/RepostIcon.vue";
import HeartIcon from "../icons/HeartIcon.vue";
import MentionIcon from "../icons/MentionIcon.vue";
import FollowIcon from "../icons/FollowIcon.vue";

const props = defineProps({
  reason: {
    type: String,
    required: true,
  },
});

const { reason } = toRefs(props);
</script>
