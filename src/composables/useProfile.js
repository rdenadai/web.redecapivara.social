// Composable to load and manage user profile data
import { ref, computed, watchEffect } from "vue";
import { getProfile } from "@/services/atproto";
import { useAuthStore } from "@/stores/auth";

export function useProfile(did) {
  const authStore = useAuthStore();

  const userName = computed(() => {
    const user = authStore.user || "";
    return user.split(".")[0] || user;
  });

  const profileData = ref({
    did: "",
    avatar: "",
    banner: "",
    displayName: "",
    description: "",
  });
  const stats = ref({
    followers: 0,
    posts: 0,
    following: 0,
  });
  const loading = ref(false);
  const error = ref(null);

  const resolvedDid = computed(() => did?.value || authStore.did);

  async function loadProfileStats() {
    loading.value = true;
    try {
      const profile = await getProfile(
        authStore.server,
        authStore.accessToken,
        resolvedDid.value
      );

      profileData.value = {
        did: profile.did,
        handle: profile.handle,
        avatar: profile.avatar || "",
        banner: profile.banner || "",
        displayName: profile.displayName || userName.value,
        description: profile.description || "",
      };

      stats.value = {
        followers: profile.followersCount || 0,
        posts: profile.postsCount || 0,
        following: profile.followsCount || 0,
      };
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      loading.value = false;
    }
  }

  // Buscar dados do perfil ao montar o componente
  watchEffect(() => {
    if (resolvedDid.value) {
      loadProfileStats();
    }
  });

  return {
    userName,
    profileData,
    stats,
    loading,
    error,
    loadProfileStats,
  };
}
