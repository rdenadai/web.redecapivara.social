// Composable to load and manage user profile data
import { ref, computed, watchEffect } from 'vue'
import { getProfile } from '@/services/atproto'
import { useAuthStore } from '@/stores/auth'
import { useCache } from './useCache'

export function useProfile(did) {
  const authStore = useAuthStore()
  const cache = useCache()

  const userName = computed(() => {
    const user = authStore.user || ''
    return user.split('.')[0] || user
  })

  const profileData = ref({
    did: '',
    avatar: '',
    banner: '',
    displayName: '',
    description: '',
  })
  const statsData = ref({
    followers: 0,
    following: 0,
    posts: 0,
  })
  const loading = ref(false)
  const error = ref(null)

  const resolvedDid = computed(() => did?.value || authStore.did)

  async function loadProfileStats() {
    loading.value = true
    try {
      const profile = await getProfile(authStore.server, authStore.accessToken, resolvedDid.value)

      return {
        profile: {
          did: profile.did,
          handle: profile.handle,
          avatar: profile.avatar || '',
          banner: profile.banner || '',
          displayName: profile.displayName || userName.value,
          description: profile.description || '',
        },
        stats: {
          followers: profile.followersCount || 0,
          following: profile.followsCount || 0,
          posts: profile.postsCount || 0,
        },
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      loading.value = false
    }
  }

  watchEffect(async () => {
    if (resolvedDid.value) {
      if (cache.has(`profile-${resolvedDid.value}`)) {
        const cached = cache.get(`profile-${resolvedDid.value}`)
        profileData.value = cached.profile
        statsData.value = cached.stats
        return
      }

      const { profile, stats } = await loadProfileStats()
      profileData.value = profile
      statsData.value = stats
      cache.set(`profile-${resolvedDid.value}`, { profile, stats })
    }
  })

  return {
    userName,
    profileData,
    statsData,
    loading,
    error,
    loadProfileStats,
  }
}
