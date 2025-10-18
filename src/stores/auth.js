import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { atprotoLogin, atprotoLogout, refreshAuthClientToken } from '@/services/atproto'
import { useCache } from '@/composables/useCache'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const server = ref(null)
  const accessToken = ref(null)
  const refreshToken = ref(null)
  const did = ref(null)

  const cache = useCache()

  const isAuthenticated = computed(() => !!accessToken.value)

  function saveSession(data) {
    user.value = data.user
    server.value = data.server
    accessToken.value = data.accessJwt
    refreshToken.value = data.refreshJwt
    did.value = data.did

    cache.set(
      'capivara_session',
      JSON.stringify({
        user: data.user,
        server: data.server,
        accessJwt: data.accessJwt,
        refreshJwt: data.refreshJwt,
        did: data.did,
      }),
      false
    )
  }

  async function checkSession() {
    const stored = cache.get('capivara_session')
    try {
      const data = JSON.parse(stored)
      user.value = data.user
      server.value = data.server
      accessToken.value = data.accessJwt
      refreshToken.value = data.refreshJwt
      did.value = data.did
    } catch (e) {
      await logout()
    }
  }

  async function clearSession() {
    await atprotoLogout(server.value, accessToken.value)
    user.value = null
    server.value = null
    accessToken.value = null
    refreshToken.value = null
    did.value = null
    cache.remove('capivara_session')
  }

  async function login(identifier, password, serverUrl) {
    try {
      const response = await atprotoLogin(identifier, password, serverUrl)

      saveSession({
        user: identifier,
        server: serverUrl,
        accessJwt: response.accessJwt,
        refreshJwt: response.refreshJwt,
        did: response.did,
      })

      return { success: true }
    } catch (error) {
      console.error('Erro no login:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erro ao fazer login',
      }
    }
  }

  async function logout() {
    clearSession()
  }

  const autoRefreshToken = async () => {
    if (!server.value || !accessToken.value || !refreshToken.value) return
    try {
      const data = await refreshAuthClientToken(server.value, accessToken.value, refreshToken.value)
      console.log('Resposta ao atualizar token:', data)

      if (!data?.accessJwt || !data?.refreshJwt) throw new Error('Resposta inválida ao atualizar token')

      accessToken.value = data.accessJwt
      refreshToken.value = data.refreshJwt
      cache.set(
        'capivara_session',
        JSON.stringify({
          user: user.value,
          server: server.value,
          accessJwt: accessToken.value,
          refreshJwt: refreshToken.value,
          did: did.value,
        }),
        false
      )
    } catch (e) {
      console.error('Erro ao atualizar token automaticamente:', e)
      logout()
    }
  }

  function jwtIsValid() {
    const token = accessToken.value
    if (!token) return false
    const payload = token.split('.')[1]
    if (!payload) return false
    try {
      const decoded = JSON.parse(atob(payload))
      const exp = decoded.exp
      if (!exp) return false
      const now = Math.floor(Date.now() / 1000)
      return exp > now
    } catch (e) {
      console.error('Erro ao validar JWT:', e)
      return false
    }
  }

  return {
    user,
    server,
    accessToken,
    refreshToken,
    did,
    isAuthenticated,
    login,
    logout,
    autoRefreshToken,
    checkSession,
    saveSession,
    jwtIsValid,
  }
})
