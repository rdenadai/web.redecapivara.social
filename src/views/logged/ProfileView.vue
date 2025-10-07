<template>
  <div class="relative">
    <div>
      <img
        v-if="profileData.banner"
        :src="profileData.banner"
        alt="Cover"
        class="w-full h-fit object-cover rounded-t-lg"
      />
      <div v-else class="w-full h-32 bg-capivara-stone/10 rounded-t-lg"></div>
    </div>
    <div class="absolute -bottom-10 left-5 z-10">
      <div
        class="w-50 h-50 bg-white/20 rounded-full flex items-center justify-center ring-4 ring-white"
      >
        <router-link
          v-if="profileData?.handle"
          :to="`/${profileData?.handle}/profile`"
        >
          <img
            v-if="profileData.avatar"
            :src="profileData.avatar"
            alt="Avatar"
            class="w-24 h-24 rounded-full object-cover"
          />
        </router-link>
      </div>
    </div>
  </div>
  <div class="flex items-center justify-between mt-14">
    <div>
      <h2 class="text-2xl font-bold mb-2 text-black/80">
        <router-link
          v-if="profileData?.handle"
          :to="`/${profileData?.handle}/profile`"
          class="hover:underline"
        >
          {{ profileData.displayName }}
        </router-link>
      </h2>
      <p class="text-black/70 mb-2">
        <router-link
          :to="`/${profileData?.handle}/followers`"
          class="hover:underline"
        >
          {{ stats.followers }} seguidores</router-link
        >
        •
        <router-link
          :to="`/${profileData?.handle}/following`"
          class="hover:underline"
        >
          {{ stats.following }} seguindo</router-link
        >
        • {{ stats.posts }} posts
      </p>
      <ParsedPost :content="profileData.description || ''" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { useRoute } from "vue-router";
import { useProfile } from "@/composables/useProfile";
import ParsedPost from "@/components/ParsedPost.vue";

const route = useRoute();

const props = defineProps({
  did: {
    type: String,
    default: null,
  },
});

const { did } = toRefs(props);

const { profileData, stats } = useProfile(did);
</script>
