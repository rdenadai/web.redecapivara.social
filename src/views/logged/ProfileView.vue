<template>
  <div class="relative">
    <div>
      <img
        v-if="profileData.banner"
        :src="profileData.banner"
        alt="Cover"
        class="w-full h-32 object-cover rounded-t-lg"
      />
      <div v-else class="w-full h-32 bg-capivara-stone/10 rounded-t-lg"></div>
    </div>
    <div class="absolute -bottom-10 left-5 hidden sm:block z-10">
      <div
        class="w-50 h-50 bg-white/20 rounded-full flex items-center justify-center ring-4 ring-white"
      >
        <img
          v-if="profileData.avatar"
          :src="profileData.avatar"
          alt="Avatar"
          class="w-24 h-24 rounded-full object-cover"
        />
      </div>
    </div>
  </div>
  <div class="flex items-center justify-between mt-14">
    <div>
      <h2 class="text-2xl font-bold mb-2 text-black/80">
        {{ profileData.displayName }}
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
      <span
        class="text-black/70"
        v-html="
          profileData.description
            ? `${profileData.description.replaceAll('\n', '<br />')}`
            : ''
        "
      ></span>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from "vue";
import { useRoute } from "vue-router";
import { useProfile } from "@/composables/useProfile";

const route = useRoute();

const props = defineProps({
  did: {
    type: String,
    default: null,
  },
});

const { userName, profileData, stats, fetchProfile } = useProfile(props.did);
</script>
