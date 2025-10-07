<template>
  <div class="min-h-screen bg-capivara-off-white">
    <MenuView />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="card mb-8 bg-gradient-to-r text-white">
        <div>
          <h1 class="text-2xl font-bold mb-2 text-black/80">
            Seguidores ({{ stats.followers }})
          </h1>
          <div class="mt-6 space-y-4">
            <div
              v-for="person in followers"
              :key="person.did"
              class="flex flex-col items-start p-4 bg-white"
            >
              <div class="flex items-start space-x-4">
                <img
                  v-if="person.avatar"
                  :src="person.avatar"
                  alt="Avatar"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 class="text-lg font-semibold text-black/80">
                    <router-link
                      :to="`/${person?.handle}/profile`"
                      class="hover:underline"
                      >{{ person.displayName || person.handle }}</router-link
                    >
                  </h2>
                  <p class="text-sm text-capivara-stone/80 font-mono">
                    <router-link
                      :to="`/${person?.handle}/profile`"
                      class="hover:underline"
                      >@{{ person.handle }}</router-link
                    >
                  </p>

                  <p>
                    <span class="text-xs text-capivara-stone/60 font-mono"
                      >DID: {{ person.did }}</span
                    >
                  </p>
                  <p
                    v-if="person.description"
                    class="text-sm text-black/70 mt-1"
                    v-html="person.description.replaceAll('\n', '<br />')"
                  ></p>
                </div>
              </div>
              <!-- Separator -->
              <div
                class="flex border-t border-capivara-stone/10 w-full mt-4"
              ></div>
            </div>
            <p
              v-if="followers.length === 0 && !loadingMore"
              class="text-capivara-stone/80"
            >
              Você ainda não tem seguidores.
            </p>

            <div v-if="loadingMore" class="text-center py-4">Carregando...</div>
            <div
              v-if="noMore && followers.length > 0"
              class="text-center py-4 text-capivara-stone/60"
            >
              Fim da lista
            </div>
          </div>
        </div>

        <div class="mt-8">
          <div class="from-capivara-brown/5 to-capivara-green-lake/5">
            <div class="text-center">
              <!-- Footer -->
              <div class="mt-5 pt-6 border-t border-capivara-stone/10">
                <p class="text-xs text-capivara-stone/50 mt-1">
                  💚 Apoie o Projeto, cada contribuição ajuda a manter o projeto
                  rodando! 🙏
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useToast } from "@/composables/useToast";
import { useAuthStore } from "@/stores/auth";
import { useProfile } from "@/composables/useProfile";
import { getFollowers, getFollows } from "@/services/atproto";
import { dedupeAppend } from "@/utils";
import MenuView from "../MenuView.vue";

const route = useRoute();
const router = useRouter();
const { error: showError } = useToast();
const authStore = useAuthStore();

const handle = computed(() => route.params.handle || null);

const did = computed(() => {
  if (handle?.value && handle?.value.includes("@")) {
    // If handle is present and looks like a handle, resolve to DID
    getDidFromHandle("https://bsky.social", null, handle).then(
      (resolvedDid) => {
        console.log("Resolved DID:", resolvedDid);
        return resolvedDid;
      }
    );
  }
  return route.params.handle || null;
});

const { profileData, stats } = useProfile(did);

const followers = ref([]);
const cursor = ref(null);
const loadingMore = ref(false);
const noMore = ref(false);
// Keep a set of DIDs that this account follows to detect mutual follows
const followsSet = ref(new Set());

async function fetchInitialFollowers() {
  if (!profileData.value) {
    router.push("/");
    return;
  }

  loadingMore.value = true;
  try {
    const response = await getFollowers(
      authStore.server,
      authStore.accessToken,
      did.value || authStore.did,
      100
    );
    followers.value = response.followers || [];
    cursor.value = response.cursor || null;
    noMore.value = !cursor.value;
    // Also fetch a (small) list of who this account follows so we can mark mutuals
    try {
      const resp2 = await getFollows(
        authStore.server,
        authStore.accessToken,
        did.value || authStore.did,
        100
      );
      const list = resp2.follows || [];
      followsSet.value = new Set(list.map((f) => f.did));
    } catch (err) {
      // Non-fatal: if we can't fetch follows, just skip mutual badges
      console.warn(
        "Não foi possível carregar lista de seguidos para detectar seguimentos mútuos",
        err
      );
    }
  } catch (err) {
    showError("Erro ao carregar seguidores.");
    console.error(err);
  } finally {
    loadingMore.value = false;
  }
}

const loadMoreFollowers = async () => {
  if (loadingMore.value || noMore.value) return;
  if (!cursor.value) {
    noMore.value = true;
    return;
  }

  loadingMore.value = true;
  try {
    const moreFollowers = await getFollowers(
      authStore.server,
      authStore.accessToken,
      authStore.did,
      100,
      cursor.value
    );

    if (moreFollowers.followers && moreFollowers.followers.length > 0) {
      followers.value = dedupeAppend(followers.value, moreFollowers.followers);
      cursor.value = moreFollowers.cursor || null;
      if (!cursor.value) noMore.value = true;
    } else {
      cursor.value = null;
      noMore.value = true;
    }
  } catch (err) {
    console.error("Error loading more followers:", err);
  } finally {
    loadingMore.value = false;
  }
};

function onScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    loadMoreFollowers();
  }
}

onMounted(() => {
  fetchInitialFollowers();
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>
