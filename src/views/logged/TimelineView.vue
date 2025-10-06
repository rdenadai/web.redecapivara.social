<!-- Timeline for the account should list and load as the user scroll posts from it's friends -->
<template>
  <div class="w-full min-h-screen">
    <!-- Main Content -->
    <main class="w-full bg-white">
      <div
        v-for="{ post, reply } in feed"
        :key="post.uri"
        class="flex flex-col items-start bg-white mb-5"
      >
        <div class="flex flex-col">
          <div class="flex items-start space-x-4">
            <img
              v-if="post.author?.avatar"
              :src="post.author.avatar"
              alt="Avatar"
              class="w-12 h-12 rounded-full object-cover"
            />
            <div class="flex-1">
              <div
                class="flex flex-col md:flex-row items-start md:items-center md:space-x-2"
              >
                <router-link
                  :to="`/${post.author?.handle}/profile`"
                  class="font-bold text-black/80 hover:underline"
                  >{{
                    post.author?.displayName || post.author?.handle
                  }}</router-link
                >
                <span class="text-sm text-capivara-stone/60 font-mono"
                  >@{{ post.author?.handle }}</span
                >
                <span class="text-sm text-capivara-stone/60 font-mono"
                  ><span class="hidden md:inline-block">•&nbsp;</span
                  >{{ new Date(post.indexedAt).toLocaleDateString() }}</span
                >
              </div>
              <p
                class="mt-1 text-black/70 whitespace-pre-wrap"
                v-html="post.record?.text?.replaceAll('\n', '<br />')"
              ></p>
              <!-- If we have embed images -->
              <div v-if="post.embed?.images?.length" class="mt-2 gap-2">
                <router-link
                  v-for="(image, idx) in post.embed.images"
                  :key="image.thumb"
                  :to="image.fullsize || image.thumb"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    :src="image.thumb"
                    alt="Embedded Image"
                    class="rounded max-h-60 object-cover"
                  />
                </router-link>
              </div>
              <!-- If we have an external embed -->
              <div
                v-if="post.embed?.external"
                class="mt-2 p-2 border border-capivara-stone/20 rounded-lg"
              >
                <a
                  :href="post.embed.external.uri"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-capivara-brown hover:underline"
                >
                  {{ post.embed.external.title || post.embed.external.uri }}
                </a>
                <p
                  v-if="post.embed.external.description"
                  class="text-sm text-black/70 mt-1"
                >
                  {{ post.embed.external.description }}
                </p>
              </div>
              <!-- Add a small bar with icons for comments, repost, likes (it shows the icon and numbers ) -->
              <div
                class="flex items-center space-x-4 mt-3 text-capivara-stone/60"
              >
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
                  <span>{{ post.replyCount || 0 }}</span>
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
                  <span>{{ post.repostCount || 0 }}</span>
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
                  <span>{{ post.likeCount || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Separator -->
        <div class="flex border-t border-capivara-stone/10 w-full mt-4"></div>
        <p
          v-if="feed.length === 0 && !loadingMore"
          class="text-capivara-stone/80"
        >
          Sua timeline está vazia. Siga pessoas para ver posts aqui.
        </p>
        <div v-if="loadingMore" class="text-center py-4">Carregando...</div>
        <div
          v-if="noMore && feed.length > 0"
          class="text-center py-4 text-capivara-stone/60"
        >
          Fim da lista
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "@/composables/useToast";
import { useAuthStore } from "@/stores/auth";
import { useProfile } from "@/composables/useProfile";
import { getTimeline } from "@/services/atproto";
import { dedupeAppend } from "@/utils";

const router = useRouter();
const { error: showError } = useToast();
const authStore = useAuthStore();
const { profileData, stats } = useProfile();

const feed = ref([]);
const cursor = ref(null);
const loadingMore = ref(false);
const noMore = ref(false);

async function fetchInitialTimeline() {
  if (!profileData.value) {
    router.push("/");
    return;
  }

  loadingMore.value = true;
  try {
    const response = await getTimeline(
      authStore.server,
      authStore.accessToken,
      authStore.did,
      25
    );
    feed.value = response.feed || [];
    cursor.value = response.cursor || null;
    noMore.value = !cursor.value;
  } catch (err) {
    showError("Erro ao carregar timeline.");
    console.error(err);
  } finally {
    loadingMore.value = false;
  }
}

const loadMoreTimeline = async () => {
  if (loadingMore.value || noMore.value) return;
  if (!cursor.value) {
    noMore.value = true;
    return;
  }

  loadingMore.value = true;
  try {
    const moreTimeline = await getTimeline(
      authStore.server,
      authStore.accessToken,
      authStore.did,
      25,
      cursor.value
    );

    if (moreTimeline.feed && moreTimeline.feed.length > 0) {
      feed.value.push(...moreTimeline.feed);
      cursor.value = moreTimeline.cursor || null;
      if (!cursor.value) noMore.value = true;
    } else {
      cursor.value = null;
      noMore.value = true;
    }
  } catch (err) {
    console.error("Error loading more Timeline:", err);
  } finally {
    loadingMore.value = false;
  }
};

function onScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    loadMoreTimeline();
  }
}

onMounted(() => {
  fetchInitialTimeline();
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>
