<template>
  <div class="min-h-screen bg-capivara-off-white">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-capivara-brown rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                ></path>
              </svg>
            </div>
            <span class="text-xl font-bold text-capivara-stone"
              >Rede Capivara</span
            >
          </div>
        </div>
      </div>
    </header>
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Background decorativo -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          class="absolute top-20 left-10 w-72 h-72 bg-capivara-brown/5 rounded-full blur-3xl"
        ></div>
        <div
          class="absolute bottom-20 right-10 w-96 h-96 bg-capivara-sky-blue/10 rounded-full blur-3xl"
        ></div>
      </div>

      <div class="w-full relative z-10">
        <!-- Card de Login -->
        <div class="card">
          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Mensagem de erro -->
            <div
              v-if="errorMessage"
              class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {{ errorMessage }}
            </div>

            <!-- Campo Usuário -->
            <div>
              <label
                for="identifier"
                class="block text-sm font-medium text-capivara-stone mb-2"
              >
                Usuário ou Email
              </label>
              <input
                id="identifier"
                v-model="form.identifier"
                type="text"
                required
                placeholder="usuario.capivara"
                class="input-field"
                :disabled="loading"
              />
            </div>

            <!-- Campo Senha -->
            <div>
              <label
                for="password"
                class="block text-sm font-medium text-capivara-stone mb-2"
              >
                Senha
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                placeholder="••••••••••••••••"
                class="input-field"
                :disabled="loading"
              />
            </div>

            <!-- Campo Servidor -->
            <div>
              <label
                for="server"
                class="block text-sm font-medium text-capivara-stone mb-2"
              >
                Servidor
              </label>
              <input
                id="server"
                v-model="form.server"
                type="url"
                required
                placeholder="https://redecapivara.social"
                class="input-field"
                :disabled="loading"
              />
              <p class="mt-1 text-xs text-capivara-stone/60">
                URL do servidor ATProtocol
              </p>
            </div>

            <!-- Botão de Login -->
            <button
              type="submit"
              class="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading"
            >
              <span v-if="!loading">Entrar</span>
              <span v-else class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Conectando...
              </span>
            </button>
          </form>

          <!-- Footer do card -->
          <div
            class="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-capivara-stone/60"
          >
            <p class="mb-2">
              Primeira vez aqui?
              <p><router-link
                to="/register"
                class="inline-flex items-center text-capivara-sky-blue hover:text-capivara-green-lake transition-colors font-medium"
              >
                Crie uma conta</router-link
              >
              ou
              <router-link
                to="/migrate"
                class="inline-flex items-center text-capivara-sky-blue hover:text-capivara-green-lake transition-colors font-medium"
              >
                Migre do Bluesky
              </router-link></p>
            </p>
          </div>

          <hr class="mt-8" />
          <!-- Doação PIX -->
          <div class="mt-8">
            <div
              class="from-capivara-brown/5 to-capivara-green-lake/5"
            >
              <div class="text-center md:w-[40em] mx-auto">
                <h3 class="text-lg font-bold text-capivara-stone mb-2">
                  💚 Apoie o Projeto
                </h3>
                <p class="text-capivara-stone/70 text-sm mb-4">
                  Ajude a manter a Rede Capivara no ar!
                </p>
                <p class="text-capivara-stone/70 text-sm mb-4">
                  Se você gosta do que fazemos e quer contribuir para a continuidade e melhoria da plataforma, considere fazer uma doação via PIX.
                </p>
                <p class="text-capivara-stone/70 text-sm mb-4">
                  Toda a infraestrutura é custeada por mim (Rodolfo De Nadai), rodando 100% em servidores no Brasil (Magalu Cloud).
                </p>

                <!-- QR Code -->
                <div class="flex justify-center mb-4">
                  <div class="bg-white p-3 rounded-xl shadow-lg">
                    <img
                      :src="pixQRCode"
                      alt="QR Code PIX"
                      class="w-32 h-32 mx-auto"
                    />
                    <p class="text-xs text-capivara-stone/60 mt-1">
                      Escaneie para doar
                    </p>
                  </div>
                </div>

                <!-- PIX Code -->
                <div class="max-w-md mx-auto">
                  <div
                    class="flex items-center gap-2 bg-white rounded-lg p-2 shadow-inner"
                  >
                    <input
                      ref="pixCodeInput"
                      :value="pixCode"
                      readonly
                      class="flex-1 text-xs font-mono text-capivara-stone bg-transparent outline-none"
                    />
                    <button
                      @click="copyPixCode"
                      class="px-3 py-1.5 bg-capivara-green-lake text-white rounded-lg text-xs font-medium hover:opacity-90 transition-all active:scale-95"
                      :class="{ 'bg-capivara-sky-blue': copied }"
                    >
                      {{ copied ? "✓" : "Copiar" }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useToast } from "@/composables/useToast";

const authStore = useAuthStore();
const router = useRouter();
const { success, error: showError } = useToast();

const form = reactive({
  identifier: "",
  password: "",
  server:
    import.meta.env.VITE_DEFAULT_SERVER_URL || "https://redecapivara.social",
});

const loading = ref(false);
const errorMessage = ref("");
const pixCodeInput = ref(null);
const copied = ref(false);

const pixCode =
  "00020126580014BR.GOV.BCB.PIX0136b9068f25-e464-4a0b-9085-72a3cad8c58c5204000053039865802BR5916Rodolfo de Nadai6009SAO PAULO6214051007yrqLjfu7630479A6";

const pixQRCode = computed(() => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    pixCode
  )}`;
});

async function handleLogin() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const result = await authStore.login(
      form.identifier,
      form.password,
      form.server
    );

    if (result.success) {
      success("Login realizado com sucesso! 🎉");
      setTimeout(() => {
        router.push("/");
      }, 500);
    } else {
      errorMessage.value = result.error;
      showError(result.error);
    }
  } catch (error) {
    const message = "Erro inesperado ao fazer login";
    errorMessage.value = message;
    showError(message);
  } finally {
    loading.value = false;
  }
}

async function copyPixCode() {
  try {
    await navigator.clipboard.writeText(pixCode);
    copied.value = true;
    success("Código PIX copiado!");

    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    pixCodeInput.value?.select();
    document.execCommand("copy");
    copied.value = true;
    success("Código PIX copiado!");

    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
}
</script>
