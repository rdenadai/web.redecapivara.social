<template>
  <div class="min-h-screen bg-capivara-off-white">
    <MenuView />
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto md:px-4">
      <div v-if="did" class="card mb-8 bg-gradient-to-r text-white">
        <ProfileView :did="did" />
        <!-- Separator -->
        <div class="mt-5 pt-6 border-t border-capivara-stone/10"></div>
        <div class="flex items-center gap-4 text-capivara-brown/80 px-4">
          <FeedView :did="did" />
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
      <div v-else class="card p-6 bg-white">
        <h2 class="text-lg font-semibold text-black/80 mb-4">
          Perfil não encontrado
        </h2>
        <p class="text-capiv ara-stone/80">
          O perfil que você está tentando acessar não existe ou o identificador
          fornecido é inválido.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { getDidFromHandle } from "@/services/atproto";
import ProfileView from "./ProfileView.vue";
import MenuView from "../MenuView.vue";
import FeedView from "./FeedView.vue";

const route = useRoute();
const authStore = useAuthStore();

const handle = computed(() => route.params.handle || null);

const did = computed(() => {
  if (handle.value && handle.value.includes("@")) {
    // If handle is present and looks like a handle, resolve to DID
    getDidFromHandle(
      authStore.server,
      authStore.accessToken,
      handle.value
    ).then((resolvedDid) => resolvedDid);
  }
  return route.params.handle || null;
});
</script>
