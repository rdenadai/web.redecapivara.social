<template>
  <!-- Author feed -->
  <div class="w-full">
    <div v-if="feed.length === 0 && !loadingMore" class="text-center py-4">
      Nenhum post encontrado.
    </div>
    <div v-for="(post, index) in feed" :key="post.post.uri" class="mb-6">
      <div class="flex items-start space-x-4">
        <img
          v-if="post.post.author?.avatar"
          :src="post.post.author.avatar"
          alt="Avatar"
          class="w-12 h-12 rounded-full object-cover mt-1"
        />
        <div class="flex flex-1 flex-col">
          <div
            class="flex flex-col md:flex-row items-start md:items-center md:space-x-2"
          >
            <router-link
              :to="`/${handleLink(
                post.post.author?.handle,
                post.post.author?.did
              )}/profile`"
              class="font-bold text-black/80 hover:underline"
              >{{
                post.post.author?.displayName || post.post.author?.handle
              }}</router-link
            >
            <span class="text-sm text-capivara-stone/60 font-mono"
              >@{{ post.post.author?.handle }}</span
            >
            <span class="text-sm text-capivara-stone/60 font-mono"
              ><span class="hidden md:inline-block">•&nbsp;</span
              >{{ new Date(post.post.indexedAt).toLocaleDateString() }}</span
            >
          </div>
          <ParsedPost
            :content="post.post.record?.text"
            :embed="post.post.record.embed"
          />
          <ImageList
            v-if="post.post?.embed?.images?.length"
            :images="post.post.embed.images"
          />
          <ExternalElement
            v-if="post.post?.record?.embed?.external"
            :external="post.post.record.embed.external"
          />

          <!-- Add a small bar with icons for comments, repost, likes (it shows the icon and numbers ) -->
          <div class="flex items-center space-x-4 mt-3 text-capivara-stone/60">
            <div
              class="flex items-center space-x-1 cursor-pointer hover:text-capivara-brown"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  fill="currentColor"
                  d="M20.002 7a2 2 0 0 0-2-2h-12a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2a1 1 0 0 1 1 1v1.918l3.375-2.7a1 1 0 0 1 .625-.218h5a2 2 0 0 0 2-2V7Zm2 8a4 4 0 0 1-4 4h-4.648l-4.727 3.781A1.001 1.001 0 0 1 7.002 22v-3h-1a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v8Z"
                />
              </svg>
              <span>{{ post.post.replyCount || 0 }}</span>
            </div>
            <div
              class="flex items-center space-x-1 cursor-pointer hover:text-capivara-brown"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  fill="currentColor"
                  d="M17.957 2.293a1 1 0 1 0-1.414 1.414L17.836 5H6a3 3 0 0 0-3 3v3a1 1 0 1 0 2 0V8a1 1 0 0 1 1-1h11.836l-1.293 1.293a1 1 0 0 0 1.414 1.414l2.47-2.47a1.75 1.75 0 0 0 0-2.474l-2.47-2.47ZM20 12a1 1 0 0 1 1 1v3a3 3 0 0 1-3 3H6.164l1.293 1.293a1 1 0 1 1-1.414 1.414l-2.47-2.47a1.75 1.75 0 0 1 0-2.474l2.47-2.47a1 1 0 0 1 1.414 1.414L6.164 17H18a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1Z"
                />
              </svg>
              <span>{{ post.post.repostCount || 0 }}</span>
            </div>
            <div
              class="flex items-center space-x-1 cursor-pointer hover:text-capivara-brown"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
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
              <span>{{ post.post.likeCount || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Separator -->
      <div class="flex border-t border-capivara-stone/10 w-full mt-4"></div>
    </div>
    <div v-if="loadingMore" class="text-center py-4">Carregando...</div>
    <div
      v-if="noMore && feed.length > 0"
      class="text-center py-4 text-capivara-stone/60"
    >
      Fim da lista
    </div>
  </div>
</template>

<script setup>
import {
  defineProps,
  ref,
  onMounted,
  onUnmounted,
  toRefs,
  watchEffect,
} from "vue";
import { useAuthStore } from "@/stores/auth";
import { getAuthorFeed } from "@/services/atproto";
import ImageList from "@/components/ImageList.vue";
import ExternalElement from "@/components/ExternalElement.vue";
import ParsedPost from "@/components/ParsedPost.vue";

const authStore = useAuthStore();

const feed = ref([]);
const cursor = ref(null);
const loadingMore = ref(false);
const noMore = ref(false);

const props = defineProps({
  did: {
    type: String,
    default: null,
  },
});

const { did } = toRefs(props);

const handleLink = (handle, did) => {
  return handle && handle !== "handle.invalid" ? handle : did;
};

const fetchInitialFeed = async () => {
  // Fetch initial feed based on props.did
  if (did?.value) {
    const authorFeed = await getAuthorFeed(
      authStore.server,
      authStore.accessToken,
      did.value
    );
    // Populate feed, cursor, noMore based on authorFeed response
    if (authorFeed.feed && authorFeed.feed.length > 0) {
      feed.value = authorFeed.feed;
      cursor.value = authorFeed.cursor || null;
      noMore.value = !cursor.value;
    } else {
      feed.value = [];
      cursor.value = null;
      noMore.value = true;
    }
  } else {
    feed.value = [];
    cursor.value = null;
    noMore.value = true;
  }
};

const loadMoreFeed = async () => {
  if (loadingMore.value || noMore.value) return;
  if (!cursor.value) {
    noMore.value = true;
    return;
  }

  loadingMore.value = true;
  try {
    const authorFeed = await getAuthorFeed(
      authStore.server,
      authStore.accessToken,
      did.value,
      25,
      cursor.value
    );
    if (authorFeed.feed && authorFeed.feed.length > 0) {
      feed.value.push(...authorFeed.feed);
      cursor.value = authorFeed.cursor || null;
      noMore.value = !cursor.value;
    } else {
      noMore.value = true;
    }
  } catch (err) {
    console.error("Error loading more feed:", err);
  } finally {
    loadingMore.value = false;
  }
};

const onScroll = async () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    await loadMoreFeed();
  }
};

onMounted(async () => {
  window.addEventListener("scroll", onScroll);
});

watchEffect(async () => {
  if (did?.value) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    await fetchInitialFeed();
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>
