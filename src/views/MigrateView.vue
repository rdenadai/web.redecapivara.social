<template>
  <div class="min-h-screen bg-capivara-off-white">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-4xl mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <router-link to="/">
            <div class="flex items-center space-x-3">
              <div class="flex items-center justify-center">
                <img
                  src="/capivara-icon.svg"
                  alt="Rede Capivara Logo"
                  class="w-12 h-12"
                />
              </div>
              <span class="text-xl font-bold text-capivara-stone"
                >Rede Capivara</span
              >
            </div>
          </router-link>
          <router-link
            to="/login"
            class="text-white bg-capivara-green-lake hover:bg-capivara-stone/80 focus:ring-4 focus:outline-none focus:ring-capivara-green-lake/50 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center transition-all active:scale-95"
          >
            ← Voltar
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto md:px-4">
      <!-- One big card that contains the whole migrate page -->
      <div class="card px-4">
        <!-- Hero -->
        <div class="text-center mb-4 py-8">
          <h1 class="text-2xl font-bold text-capivara-stone mb-4">
            Migre do Bluesky para a Rede Capivara
          </h1>
          <p class="text-lg text-capivara-stone/70 max-w-2xl mx-auto">
            Traga sua identidade, seguidores e conteúdo do Bluesky para o nosso
            servidor brasileiro. O processo é simples e mantém sua presença na
            rede.
          </p>
        </div>

        <!-- Migration Form -->
        <div class="w-full mx-auto">
          <div>
            <h2 class="text-2xl font-bold text-capivara-stone mb-6">
              Iniciar Migração
            </h2>

            <div v-if="!migrationStarted" class="space-y-6">
              <!-- Step 1: Account Info -->
              <div>
                <h3
                  class="text-lg font-semibold text-capivara-stone mb-4 flex items-center"
                >
                  <span
                    class="w-8 h-8 bg-capivara-sky-blue text-white rounded-full flex items-center justify-center mr-3 text-sm"
                    >1</span
                  >
                  Informações da Conta Bluesky
                </h3>
                <div class="space-y-4 ml-11">
                  <div>
                    <label
                      class="block text-sm font-medium text-capivara-stone mb-2"
                    >
                      Handle ou DID do Bluesky
                    </label>
                    <input
                      v-model="blueskyHandle"
                      type="text"
                      placeholder="usuario.bsky.social"
                      class="input-field"
                    />
                    <p class="text-xs text-capivara-stone/60 mt-1">
                      Seu identificador atual no Bluesky
                    </p>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-capivara-stone mb-2"
                    >
                      Senha do App ou Token
                    </label>
                    <input
                      v-model="blueskyPassword"
                      type="password"
                      placeholder="••••••••"
                      class="input-field"
                    />
                    <p class="text-xs text-capivara-stone/60 mt-1">
                      Use uma senha de app para maior segurança
                    </p>
                  </div>
                </div>
              </div>

              <!-- Step 2: New Account -->
              <div class="pt-6 border-t border-gray-200">
                <h3
                  class="text-lg font-semibold text-capivara-stone mb-4 flex items-center"
                >
                  <span
                    class="w-8 h-8 bg-capivara-green-lake text-white rounded-full flex items-center justify-center mr-3 text-sm"
                    >2</span
                  >
                  Nova Conta na Rede Capivara
                </h3>
                <div class="space-y-4 ml-11">
                  <!-- Keep Handle Option -->
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label class="flex items-start space-x-3 cursor-pointer">
                      <input
                        v-model="keepHandle"
                        type="checkbox"
                        class="w-4 h-4 mt-1 text-capivara-sky-blue rounded focus:ring-capivara-sky-blue"
                      />
                      <div class="flex-1">
                        <span
                          class="text-sm font-medium text-capivara-stone block"
                        >
                          🎯 Manter meu nome de usuário do Bluesky
                        </span>
                        <span class="text-xs text-capivara-stone/60">
                          Seu nome será mantido, mas o domínio mudará de
                          .bsky.social para .redecapivara.social
                        </span>
                      </div>
                    </label>
                  </div>

                  <div v-if="!keepHandle">
                    <label
                      class="block text-sm font-medium text-capivara-stone mb-2"
                    >
                      Novo Handle
                    </label>
                    <div class="flex items-center gap-2">
                      <input
                        v-model="newHandle"
                        type="text"
                        placeholder="meunome"
                        class="input-field flex-1"
                        :required="!keepHandle"
                      />
                      <span
                        class="text-capivara-stone/60 text-sm whitespace-nowrap"
                      >
                        .redecapivara.social
                      </span>
                    </div>
                  </div>
                  <div
                    v-else
                    class="bg-gray-50 border border-gray-200 rounded-lg p-3"
                  >
                    <p class="text-sm text-capivara-stone/70">
                      <strong>Seu novo handle será:</strong>
                      <span
                        class="text-capivara-green-lake font-mono ml-1 block mt-1"
                      >
                        @{{
                          blueskyHandle.replace(".bsky.social", "")
                        }}.redecapivara.social
                      </span>
                    </p>
                    <p class="text-xs text-capivara-stone/60 mt-2">
                      ⚠️ O domínio deve mudar para .redecapivara.social
                      (requerido pelo ATProtocol)
                    </p>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-capivara-stone mb-2"
                    >
                      Email
                    </label>
                    <input
                      v-model="newEmail"
                      type="email"
                      placeholder="seu@email.com"
                      class="input-field"
                      required
                    />
                    <p class="text-xs text-capivara-stone/60 mt-1">
                      ⚠️ Importante: você receberá um código de confirmação
                      neste email
                    </p>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-capivara-stone mb-2"
                    >
                      Senha
                    </label>
                    <input
                      v-model="newPassword"
                      type="password"
                      placeholder="••••••••"
                      class="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-capivara-stone mb-2"
                    >
                      Código de Convite
                    </label>
                    <input
                      v-model="inviteCode"
                      type="text"
                      placeholder="redecapivara-xxxxx-xxxxx"
                      class="input-field"
                      required
                    />
                    <p class="text-xs text-capivara-stone/60 mt-1">
                      🔑 Código necessário para criar conta no servidor
                    </p>
                  </div>
                </div>
              </div>

              <!-- Step 3: Migration Options -->
              <div class="pt-6 border-t border-gray-200">
                <h3
                  class="text-lg font-semibold text-capivara-stone mb-4 flex items-center"
                >
                  <span
                    class="w-8 h-8 bg-capivara-brown text-white rounded-full flex items-center justify-center mr-3 text-sm"
                    >3</span
                  >
                  O que deseja migrar?
                </h3>
                <div class="space-y-3 ml-11">
                  <label class="flex items-center space-x-3 cursor-pointer">
                    <input
                      v-model="migrateProfile"
                      type="checkbox"
                      class="w-4 h-4 text-capivara-green-lake rounded focus:ring-capivara-green-lake"
                      checked
                    />
                    <span class="text-sm text-capivara-stone">
                      <strong>Perfil</strong> - Bio, avatar, banner
                    </span>
                  </label>

                  <label class="flex items-center space-x-3 cursor-pointer">
                    <input
                      v-model="migratePosts"
                      type="checkbox"
                      class="w-4 h-4 text-capivara-green-lake rounded focus:ring-capivara-green-lake"
                      checked
                    />
                    <span class="text-sm text-capivara-stone">
                      <strong>Posts</strong> - Todos seus posts e mídia
                    </span>
                  </label>

                  <label class="flex items-center space-x-3 cursor-pointer">
                    <input
                      v-model="migrateFollows"
                      type="checkbox"
                      class="w-4 h-4 text-capivara-green-lake rounded focus:ring-capivara-green-lake"
                      checked
                    />
                    <span class="text-sm text-capivara-stone">
                      <strong>Seguindo</strong> - Lista de quem você segue
                    </span>
                  </label>

                  <label class="flex items-center space-x-3 cursor-pointer">
                    <input
                      v-model="migrateLikes"
                      type="checkbox"
                      class="w-4 h-4 text-capivara-green-lake rounded focus:ring-capivara-green-lake"
                    />
                    <span class="text-sm text-capivara-stone">
                      <strong>Curtidas</strong> - Posts que você curtiu
                    </span>
                  </label>

                  <label class="flex items-center space-x-3 cursor-pointer">
                    <input
                      v-model="migrateBlocks"
                      type="checkbox"
                      class="w-4 h-4 text-capivara-green-lake rounded focus:ring-capivara-green-lake"
                    />
                    <span class="text-sm text-capivara-stone">
                      <strong>Bloqueios</strong> - Usuários bloqueados
                    </span>
                  </label>
                </div>
              </div>

              <!-- Terms -->
              <div class="pt-6 border-t border-gray-200">
                <label class="flex items-start space-x-3 cursor-pointer">
                  <input
                    v-model="acceptTerms"
                    type="checkbox"
                    class="w-4 h-4 mt-1 text-capivara-green-lake rounded focus:ring-capivara-green-lake"
                  />
                  <span class="text-sm text-capivara-stone/70">
                    Confirmo que tenho autorização para migrar esta conta e
                    aceito os
                    <a href="#" class="text-capivara-sky-blue hover:underline"
                      >termos de serviço</a
                    >
                    da Rede Capivara.
                  </span>
                </label>
              </div>

              <!-- Actions -->
              <div class="flex gap-4">
                <button
                  @click="startMigration"
                  :disabled="!canStartMigration"
                  class="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-capivara-stone/80"
                >
                  Iniciar Migração
                </button>
              </div>
            </div>

            <!-- Migration Progress -->
            <div v-else class="space-y-6">
              <div class="text-center">
                <div
                  class="inline-flex items-center justify-center w-20 h-20 bg-capivara-green-lake/10 rounded-full mb-4"
                >
                  <svg
                    v-if="!migrationComplete"
                    class="animate-spin w-10 h-10 text-capivara-green-lake"
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
                  <svg
                    v-else
                    class="w-10 h-10 text-capivara-green-lake"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-capivara-stone mb-2">
                  {{
                    migrationComplete
                      ? "✅ Migração Concluída!"
                      : "⏳ Migrando sua conta..."
                  }}
                </h3>
                <p class="text-capivara-stone/60">
                  {{
                    migrationComplete
                      ? "Bem-vindo à Rede Capivara!"
                      : "Isso pode levar alguns minutos"
                  }}
                </p>
              </div>

              <!-- Progress Steps -->
              <div class="space-y-3">
                <div
                  v-for="step in migrationSteps"
                  :key="step.id"
                  class="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                >
                  <div
                    v-if="step.status === 'completed'"
                    class="w-6 h-6 bg-capivara-green-lake rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <svg
                      class="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <div
                    v-else-if="step.status === 'processing'"
                    class="w-6 h-6 border-2 border-capivara-sky-blue border-t-transparent rounded-full animate-spin flex-shrink-0"
                  ></div>
                  <div
                    v-else
                    class="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0"
                  ></div>

                  <div class="flex-1">
                    <p class="text-sm font-medium text-capivara-stone">
                      {{ step.title }}
                    </p>
                    <p
                      v-if="step.description"
                      class="text-xs text-capivara-stone/60"
                    >
                      {{ step.description }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Email Confirmation (if required) -->
              <div
                v-if="requiresEmailConfirmation && !migrationComplete"
                class="pt-6 border-t border-gray-200"
              >
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4
                    class="text-lg font-semibold text-capivara-stone mb-3 flex items-center"
                  >
                    <svg
                      class="w-6 h-6 mr-2 text-capivara-sky-blue"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                    Confirmação por Email
                  </h4>
                  <p class="text-sm text-capivara-stone/70 mb-4">
                    Enviamos um código de confirmação para
                    <strong>{{ newEmail }}</strong
                    >. Digite o código para finalizar a migração da sua
                    identidade.
                  </p>
                  <div class="flex gap-3">
                    <input
                      v-model="emailToken"
                      type="text"
                      placeholder="Digite o código recebido"
                      class="input-field flex-1"
                    />
                    <button
                      @click="confirmWithEmail"
                      :disabled="!emailToken"
                      class="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      Confirmar
                    </button>
                  </div>
                  <p class="text-xs text-capivara-stone/60 mt-3">
                    ℹ️ Não recebeu? Verifique sua caixa de spam ou aguarde
                    alguns minutos.
                  </p>
                </div>
              </div>

              <!-- Error Message -->
              <div
                v-if="migrationError"
                class="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <div class="flex items-start gap-3">
                  <svg
                    class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-red-800">
                      Erro na migração
                    </p>
                    <p class="text-sm text-red-700 mt-1">
                      {{ migrationError }}
                    </p>
                  </div>
                </div>
                <button
                  @click="resetMigration"
                  class="mt-4 text-sm text-red-700 hover:text-red-900 underline"
                >
                  ← Tentar novamente
                </button>
              </div>

              <div v-if="migrationComplete" class="pt-6">
                <router-link
                  to="/login"
                  class="btn-primary w-full block text-center"
                >
                  Fazer Login na Rede Capivara
                </router-link>
              </div>
            </div>
          </div>

          <!-- Info Cards -->
          <div class="grid md:grid-cols-2 gap-6 mt-12">
            <div class="card bg-blue-50 p-4 rounded-lg">
              <h3
                class="text-lg font-semibold text-capivara-stone mb-3 flex items-center"
              >
                <svg
                  class="w-5 h-5 mr-2 text-capivara-sky-blue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                Sobre a Migração
              </h3>
              <ul class="space-y-2 text-sm text-capivara-stone/70">
                <li class="flex items-start">
                  <span class="mr-2">•</span>
                  <span>Seus dados ficam em um servidor brasileiro</span>
                </li>
                <li class="flex items-start">
                  <span class="mr-2">•</span>
                  <span>Você mantém controle total sobre seu conteúdo</span>
                </li>
                <li class="flex items-start">
                  <span class="mr-2">•</span>
                  <span>Continua conectado com a rede ATProtocol</span>
                </li>
                <li class="flex items-start">
                  <span class="mr-2">•</span>
                  <span>Pode voltar para o Bluesky quando quiser</span>
                </li>
              </ul>
            </div>

            <div class="card bg-green-50 p-4 rounded-lg">
              <h3
                class="text-lg font-semibold text-capivara-stone mb-3 flex items-center"
              >
                <svg
                  class="w-5 h-5 mr-2 text-capivara-green-lake"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
                Segurança
              </h3>
              <ul class="space-y-2 text-sm text-capivara-stone/70">
                <li class="flex items-start">
                  <span class="mr-2">•</span>
                  <span>Suas senhas nunca são armazenadas</span>
                </li>
                <li class="flex items-start">
                  <span class="mr-2">•</span>
                  <span>Use senhas de app para maior proteção</span>
                </li>
                <li class="flex items-start">
                  <span class="mr-2">•</span>
                  <span>Dados criptografados durante transferência</span>
                </li>
                <li class="flex items-start">
                  <span class="mr-2">•</span>
                  <span>Você pode apagar sua conta Bluesky depois</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "@/composables/useToast";
import { migrateAccount, completeMigration } from "@/services/atproto";

const router = useRouter();
const { success, error: showError, info, warning } = useToast();

// Form data
const blueskyHandle = ref("");
const blueskyPassword = ref("");
const newHandle = ref("");
const newEmail = ref("");
const newPassword = ref("");
const inviteCode = ref("");
const keepHandle = ref(false);

// Migration options
const migrateProfile = ref(true);
const migratePosts = ref(true);
const migrateFollows = ref(true);
const migrateLikes = ref(false);
const migrateBlocks = ref(false);
const acceptTerms = ref(false);

// Migration state
const migrationStarted = ref(false);
const migrationComplete = ref(false);
const migrationError = ref("");
const requiresEmailConfirmation = ref(false);
const emailToken = ref("");
const migrationData = ref(null);

const migrationSteps = ref([
  {
    id: 1,
    title: "Validando conta Bluesky",
    status: "pending",
    description: "",
  },
  {
    id: 2,
    title: "Criando conta na Rede Capivara",
    status: "pending",
    description: "",
  },
  {
    id: 3,
    title: "Exportando perfil e repositório",
    status: "pending",
    description: "",
  },
  {
    id: 4,
    title: "Migrando posts e mídia",
    status: "pending",
    description: "",
  },
  {
    id: 5,
    title: "Importando conexões e preferências",
    status: "pending",
    description: "",
  },
  { id: 6, title: "Finalizando migração", status: "pending", description: "" },
]);

const canStartMigration = computed(() => {
  return (
    blueskyHandle.value &&
    blueskyPassword.value &&
    (keepHandle.value || newHandle.value) &&
    newEmail.value &&
    newPassword.value &&
    inviteCode.value &&
    acceptTerms.value
  );
});

function updateMigrationProgress({ step, status, message }) {
  const stepIndex = step - 1;
  if (stepIndex >= 0 && stepIndex < migrationSteps.value.length) {
    migrationSteps.value[stepIndex].status = status;
    if (message) {
      migrationSteps.value[stepIndex].description = message;
    }
  }
}

async function startMigration() {
  if (!canStartMigration.value) {
    showError("Preencha todos os campos obrigatórios");
    return;
  }

  migrationStarted.value = true;
  migrationError.value = "";
  info("Iniciando migração...");

  try {
    const result = await migrateAccount(
      {
        blueskyHandle: blueskyHandle.value,
        blueskyPassword: blueskyPassword.value,
        newHandle: newHandle.value,
        newEmail: newEmail.value,
        newPassword: newPassword.value,
        inviteCode: inviteCode.value,
        keepHandle: keepHandle.value,
      },
      updateMigrationProgress
    );

    if (result.requiresEmailConfirmation) {
      requiresEmailConfirmation.value = true;
      migrationData.value = result;
      warning("📧 Verifique seu email para confirmar a mudança de identidade");
      info("Digite o código de confirmação recebido por email para finalizar");
    } else {
      // Migration complete without email confirmation
      migrationComplete.value = true;

      // Auto-login to Rede Capivara with new credentials
      const finalHandle = keepHandle.value
        ? blueskyHandle.value.replace(".bsky.social", "")
        : newHandle.value;

      const loginResult = await authStore.login(
        `${finalHandle}.redecapivara.social`,
        newPassword.value,
        "https://redecapivara.social"
      );

      if (loginResult.success) {
        success("🎉 Migração concluída com sucesso! Redirecionando...");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        success("🎉 Migração concluída! Faça login na Rede Capivara");
      }
    }
  } catch (error) {
    console.error("Migration error:", error);
    migrationError.value = error.message || "Erro ao realizar migração";
    showError(migrationError.value);

    // Reset migration steps on error
    migrationSteps.value.forEach((step) => {
      if (step.status === "processing") {
        step.status = "pending";
      }
    });
    migrationStarted.value = false;
  }
}

async function confirmWithEmail() {
  if (!emailToken.value) {
    showError("Digite o código de confirmação");
    return;
  }

  updateMigrationProgress({
    step: 6,
    status: "processing",
    message: "Finalizando com código de email...",
  });

  try {
    await completeMigration(
      migrationData.value.oldAccessToken,
      migrationData.value.newAccessToken,
      emailToken.value,
      migrationData.value.didCreds
    );

    migrationComplete.value = true;
    requiresEmailConfirmation.value = false;
    updateMigrationProgress({
      step: 6,
      status: "completed",
      message: "Migração finalizada!",
    });

    // Auto-login to Rede Capivara with new credentials
    const finalHandle = keepHandle.value
      ? blueskyHandle.value.replace(".bsky.social", "")
      : newHandle.value;

    const loginResult = await authStore.login(
      `${finalHandle}.redecapivara.social`,
      newPassword.value,
      "https://redecapivara.social"
    );

    if (loginResult.success) {
      success("🎉 Migração concluída com sucesso! Redirecionando...");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      success("🎉 Migração concluída! Faça login manualmente");
    }
  } catch (error) {
    console.error("Email confirmation error:", error);
    showError(error.message || "Código inválido ou expirado");
    updateMigrationProgress({
      step: 6,
      status: "pending",
      message: "Aguardando confirmação...",
    });
  }
}

function resetMigration() {
  migrationStarted.value = false;
  migrationComplete.value = false;
  migrationError.value = "";
  requiresEmailConfirmation.value = false;
  emailToken.value = "";
  migrationData.value = null;

  migrationSteps.value.forEach((step) => {
    step.status = "pending";
    step.description = "";
  });
}
</script>
