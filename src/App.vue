<template>
  <div id="app" class="min-h-screen">
    <!-- Container de Toasts -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <ToastNotification
        v-for="toast in toasts"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type"
        :duration="toast.duration"
        @close="removeToast(toast.id)"
      />
    </div>
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useOnline } from '@/composables/useOnline'
import { useToast } from '@/composables/useToast'
import ToastNotification from '@/components/ToastNotification.vue'

const tokenRefreshInterval = 15 * 60 * 1000 // 15 minutes

const authStore = useAuthStore()
const router = useRouter()
const { isOnline } = useOnline()
const { toasts, removeToast, warning, success } = useToast()

const autoRefreshTokenIntervalId = ref(null)

const refreshAuthClientToken = async () => {
  await authStore.autoRefreshToken()
}

onMounted(async () => {
  // Verifica se há sessão salva
  authStore.checkSession()

  // Se estiver autenticado, redireciona para home
  if (authStore.isAuthenticated && router.currentRoute.value.path === '/login') {
    router.push('/')
  } else {
    autoRefreshTokenIntervalId.value = setInterval(refreshAuthClientToken, tokenRefreshInterval)
  }
})

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
})

// Monitora mudanças no status de conexão
watch(isOnline, (newValue, oldValue) => {
  if (oldValue !== undefined) {
    if (newValue) {
      success('Conexão restaurada! 🎉')
    } else {
      warning('Você está offline', 0)
    }
  }
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
}
</style>
