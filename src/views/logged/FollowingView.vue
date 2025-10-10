<template>
  <div class="min-h-screen bg-capivara-off-white">
    <MenuView />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto md:px-4 md:py-4">
      <div class="card mb-8 bg-gradient-to-r text-white">
        <div>
          <h1 class="text-2xl font-bold mb-2 text-black/80 px-4 py-4">
            Seguindo ({{ statsData.following }})
          </h1>
          <div class="mt-6 space-y-4">
            <div
              v-for="person in following"
              :key="person.did"
              class="flex flex-col items-start justify-between p-4 bg-white"
            >
              <div class="flex items-start">
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
                    <p
                      v-if="person.description"
                      class="text-sm text-black/70 mt-1"
                      v-html="person.description.replaceAll('\n', '<br />')"
                    ></p>
                  </div>
                </div>

                <div class="flex flex-col items-end gap-2">
                  <span
                    v-if="followersSet.has(person.did)"
                    class="text-xs bg-capivara-stone/50 text-white px-2 py-1 rounded-full"
                    title="Essa pessoa também te segue"
                  >
                    Segue você
                  </span>
                </div>
              </div>
              <!-- Separator -->
              <div
                class="flex border-t border-capivara-stone/10 w-full mt-4"
              ></div>
            </div>
            <p
              v-if="following.length === 0 && !loadingMore"
              class="text-capivara-stone/80"
            >
              Você ainda não segue ninguém.
            </p>

            <div v-if="loadingMore" class="text-center py-4">Carregando...</div>
            <div
              v-if="noMore && following.length > 0"
              class="text-center py-4 text-capivara-stone/60"
            >
              Fim da lista
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
import { getFollows, getFollowers } from "@/services/atproto";
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
    getDidFromHandle(authStore.server, authStore.accessToken, handle).then(
      (resolvedDid) => resolvedDid
    );
  }
  return route.params.handle || null;
});

const { profileData, statsData } = useProfile(did);

const following = ref([]);
const cursor = ref(null);
const loadingMore = ref(false);
const noMore = ref(false);

// Keep a set of follower DIDs to detect mutual follows ("Segue você")
const followersSet = ref(new Set());

async function fetchInitialFollowing() {
  if (!profileData.value) {
    router.push("/");
    return;
  }

  loadingMore.value = true;
  try {
    // Load the people this account follows
    const response = await getFollows(
      authStore.server,
      authStore.accessToken,
      did.value || authStore.did,
      100
    );

    following.value = response.follows || [];
    cursor.value = response.cursor || null;
    noMore.value = !cursor.value;

    // Also fetch followers (small set) to detect mutual follows
    try {
      const resp2 = await getFollowers(
        authStore.server,
        authStore.accessToken,
        did.value || authStore.did,
        100
      );
      const list = resp2.followers || [];
      followersSet.value = new Set(list.map((f) => f.did));
    } catch (err) {
      console.warn(
        "Não foi possível carregar seguidores para mutual badge",
        err
      );
    }
  } catch (err) {
    showError("Erro ao carregar quem você segue.");
    console.error(err);
  } finally {
    loadingMore.value = false;
  }
}

const loadMoreFollowing = async () => {
  if (loadingMore.value || noMore.value) return;
  if (!cursor.value) {
    noMore.value = true;
    return;
  }

  loadingMore.value = true;
  try {
    const more = await getFollows(
      authStore.server,
      authStore.accessToken,
      authStore.did,
      100,
      cursor.value
    );

    if (more.follows && more.follows.length > 0) {
      following.value = dedupeAppend(following.value, more.follows);
      cursor.value = more.cursor || null;
      if (!cursor.value) noMore.value = true;
    } else {
      cursor.value = null;
      noMore.value = true;
    }
  } catch (err) {
    console.error("Error loading more following:", err);
  } finally {
    loadingMore.value = false;
  }
};

function onScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    loadMoreFollowing();
  }
}

onMounted(() => {
  fetchInitialFollowing();
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>
