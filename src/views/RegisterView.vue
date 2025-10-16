<template>
  <!-- Header -->
  <header class="bg-white shadow-sm">
    <div class="max-w-4xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <router-link to="/">
          <div class="flex items-center space-x-3">
            <div class="flex items-center justify-center">
              <img src="/capivara-icon.svg" alt="Rede Capivara Logo" class="w-12 h-12" />
            </div>
            <span class="text-xl font-bold text-capivara-stone">Rede Capivara</span>
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
  <main class="max-w-4xl mx-auto md:px-4 md:py-4 min-h-screen md:max-h-fit">
    <!-- Background decorativo -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-72 h-72 bg-capivara-brown/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-capivara-sky-blue/10 rounded-full blur-3xl"></div>
    </div>

    <div class="w-full relative z-10 min-h-screen md:max-h-fit">
      <div class="card px-4 py-6 min-h-screen md:min-h-fit">
        <div class="text-sm mb-6">
          Esta é uma interface independente para uso em conjunto com a Rede Capivara (que é um PDS ATProtocol
          independente).
        </div>
        <hr class="mt-4" />
        <form @submit.prevent class="space-y-5 mt-4">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-capivara-stone mb-2">Handle</label>
              <div class="flex items-center gap-2">
                <input
                  v-model="newHandle"
                  type="text"
                  placeholder="meunome"
                  class="input-field flex-1"
                  :required="true"
                  :disabled="disableCreateAccountButton"
                />
                <span class="text-capivara-stone/60 text-sm whitespace-nowrap"> .redecapivara.social </span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-capivara-stone mb-2"> Email </label>
              <input
                v-model="newEmail"
                :disabled="disableCreateAccountButton"
                type="email"
                placeholder="seu@email.com"
                class="input-field"
                required
              />
              <p class="text-xs text-capivara-stone/60 mt-1">
                ⚠️ Importante: você receberá um código de confirmação neste email
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-capivara-stone mb-2"> Senha </label>
              <div class="relative">
                <div>
                  <input
                    v-if="!showPassword"
                    v-model="newPassword"
                    :disabled="disableCreateAccountButton"
                    type="password"
                    placeholder="••••••••"
                    class="input-field"
                    maxlength="32"
                    required
                  />
                  <input
                    v-else
                    v-model="newPassword"
                    :disabled="disableCreateAccountButton"
                    placeholder="••••••••"
                    class="input-field"
                    maxlength="32"
                    required
                  />
                </div>
                <div
                  class="w-4 h-4 cursor-pointer absolute right-8 bottom-4 -translate-y-1/2"
                  @click="showHidePassword"
                  :title="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
                >
                  <EyeSlashIcon v-if="!showPassword" class="w-4 h-4 text-gray-300" />
                  <EyeIcon v-else class="w-4 h-4 text-gray-300" />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-capivara-stone mb-2">
                Digite a senha novamente para confirmar
              </label>
              <div>
                <input
                  v-model="comparePassword"
                  :disabled="disableCreateAccountButton"
                  type="password"
                  placeholder="••••••••"
                  class="input-field"
                  maxlength="32"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-capivara-stone mb-2"> Código de Convite </label>
              <input
                v-model="inviteCode"
                :disabled="disableCreateAccountButton"
                type="text"
                placeholder="redecapivara-social-xxxxx-xxxxx"
                class="input-field"
                required
              />
              <p class="text-xs text-capivara-stone/60 mt-1">🔑 Código necessário para criar conta no servidor</p>
            </div>
          </div>
          <!-- Actions -->
          <div class="flex gap-4">
            <button
              @click="createAccountCall"
              :disabled="!canCreateAccount || disableCreateAccountButton"
              class="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-capivara-stone/80 cursor-pointer"
            >
              Criar Conta
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { createAccount } from '@/services/atproto'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import EyeSlashIcon from '@/components/icons/EyeSlashIcon.vue'

const router = useRouter()
const toast = useToast()

// Form data
const newHandle = ref('')
const newEmail = ref('')
const newPassword = ref('')
const comparePassword = ref('')
const inviteCode = ref('')
const showPassword = ref(false)
const disableCreateAccountButton = ref(false)

const canCreateAccount = computed(() => {
  if (newPassword.value.length < 8) return false
  if (newPassword.value !== comparePassword.value) return false
  return newHandle.value && newEmail.value && newPassword.value && inviteCode.value
})

const showHidePassword = () => {
  showPassword.value = !showPassword.value
}

const createAccountCall = async () => {
  if (!canCreateAccount.value) return

  try {
    const response = await createAccount({
      handle: newHandle.value,
      email: newEmail.value,
      password: newPassword.value,
      inviteCode: inviteCode.value,
    })
    if (response.status !== 200) {
      throw new Error(`Erro ao criar conta: ${newHandle.value} - ${response.status}`)
    }
    disableCreateAccountButton.value = true
    toast.success('Conta criada com sucesso! Verifique seu email para o código de confirmação.')
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  } catch (error) {
    disableCreateAccountButton.value = false
    console.error('Erro ao criar conta:', error)
    toast.error(`Erro ao criar conta: ${error.response?.data?.message || error.message}`)
  }
}
</script>
