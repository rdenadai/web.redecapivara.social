<template>
  <div id="app" class="min-h-screen">
    <!-- Indicador de conexão offline -->
    <transition name="slide-down">
      <div
        v-if="!isOnline"
        class="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white text-center py-2 text-sm font-medium"
      >
        📡 Você está offline - Algumas funcionalidades podem não estar
        disponíveis
      </div>
    </transition>

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
import { onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useOnline } from "@/composables/useOnline";
import { useToast } from "@/composables/useToast";
import ToastNotification from "@/components/ToastNotification.vue";

const authStore = useAuthStore();
const router = useRouter();
const { isOnline } = useOnline();
const { toasts, removeToast, warning, success } = useToast();

onMounted(() => {
  // Verifica se há sessão salva
  authStore.checkSession();

  // Se estiver autenticado, redireciona para home
  if (
    authStore.isAuthenticated &&
    router.currentRoute.value.path === "/login"
  ) {
    router.push("/");
  }
});

// Monitora mudanças no status de conexão
watch(isOnline, (newValue, oldValue) => {
  if (oldValue !== undefined) {
    if (newValue) {
      success("Conexão restaurada! 🎉");
    } else {
      warning("Você está offline", 0);
    }
  }
});
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
