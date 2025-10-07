<template>
  <!-- Header -->
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo --><router-link to="/">
          <div class="flex items-center space-x-3">
            <div class="flex items-center justify-center">
              <img
                src="/capivara-icon.svg"
                alt="Rede Capivara Logo"
                class="w-12 h-12"
              />
            </div>
            <span class="text-xl font-bold text-capivara-stone">
              Rede Capivara
            </span>
          </div>
        </router-link>

        <!-- User menu -->
        <div class="flex items-center space-x-4">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium text-capivara-stone">
              @{{ authStore.user }}
            </p>
            <p class="text-xs text-capivara-stone/60">{{ serverName }}</p>
          </div>

          <div class="relative group">
            <img
              v-if="profileData.avatar"
              :src="profileData.avatar"
              alt="Avatar"
              class="w-10 h-10 rounded-full object-cover cursor-pointer"
            />
            <div
              class="absolute right-0 mt-2 w-fit bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
            >
              <div class="px-4 py-2">
                <div class="space-y-1 text-xs">
                  <div class="flex justify-between items-center">
                    <span class="text-capivara-stone/60">DID:</span>
                    <span class="text-capivara-stone font-mono ml-2">{{
                      authStore.did || "N/A"
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-capivara-stone/60">Servidor:</span>
                    <span class="text-capivara-sky-blue font-medium ml-2">{{
                      serverName
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-capivara-stone/60">Status:</span>
                    <span
                      class="flex items-center text-capivara-green-lake font-medium"
                    >
                      <span
                        class="w-2 h-2 bg-capivara-green-lake rounded-full mr-1"
                      ></span>
                      Conectado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <InstallButton />

          <button
            @click="handleLogout"
            class="p-2 rounded-lg hover:bg-capivara-off-white transition-colors"
            title="Sair"
          >
            <svg
              class="w-5 h-5 text-capivara-stone"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useProfile } from "@/composables/useProfile";

const authStore = useAuthStore();
const router = useRouter();
const { profileData } = useProfile();

const serverName = computed(() => {
  try {
    const url = new URL(authStore.server || "");
    return url.hostname;
  } catch {
    return "N/A";
  }
});

function handleLogout() {
  if (confirm("Deseja realmente sair?")) {
    authStore.logout();
    router.push("/login");
  }
}
</script>
