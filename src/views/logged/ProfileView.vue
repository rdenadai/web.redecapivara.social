<template>
  <div class="relative">
    <div>
      <img
        v-if="profileData.banner"
        :src="profileData.banner"
        alt="Cover"
        class="w-full max-h-64 object-cover md:rounded-t-lg"
      />
      <div v-else class="w-full h-32 bg-capivara-stone/10 rounded-t-lg"></div>
    </div>
    <div class="absolute -bottom-10 left-5 z-10">
      <div
        class="w-fit h-fit bg-white/20 rounded-full flex items-center justify-center ring-4 ring-white"
      >
        <router-link
          v-if="profileData?.handle"
          :to="`/${profileData?.handle}/profile`"
        >
          <img
            v-if="profileData.avatar"
            :src="profileData.avatar"
            alt="Avatar"
            class="w-32 h-32 rounded-full object-cover"
          />
        </router-link>
      </div>
    </div>
  </div>
  <div class="flex items-center justify-between mt-14 px-4">
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
          {{ statsData.followers }} seguidores</router-link
        >
        •
        <router-link
          :to="`/${profileData?.handle}/following`"
          class="hover:underline"
        >
          {{ statsData.following }} seguindo</router-link
        >
        • {{ statsData.posts }} posts
      </p>
      <ParsedPost :content="profileData.description || ''" />
    </div>
  </div>
</template>

<script setup>
import { toRefs } from "vue";
import { useProfile } from "@/composables/useProfile";
import ParsedPost from "@/components/ParsedPost.vue";

const props = defineProps({
  did: {
    type: String,
    default: null,
  },
});

const { did } = toRefs(props);

const { profileData, statsData } = useProfile(did);
</script>
